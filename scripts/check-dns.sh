#!/usr/bin/env bash
# Verifies anandkrishna.me before, during and after the Cloudflare migration.
#
#   bash scripts/check-dns.sh                          # what the world sees now
#   bash scripts/check-dns.sh kate.ns.cloudflare.com   # PRE-FLIGHT: ask Cloudflare directly
#
# Pass one of your Cloudflare nameservers to query the new zone *before* changing
# anything at GoDaddy. That proves the records are right while the domain is still
# safely delegated to GoDaddy — the whole point being not to discover a missing MX
# record after mail has already stopped.
set -uo pipefail
DOMAIN="${1:-anandkrishna.me}"
NS_DIRECT=""
# If the first argument looks like a nameserver, treat it as one.
case "$DOMAIN" in
  *ns*.*|*.cloudflare.com) NS_DIRECT="$DOMAIN"; DOMAIN="${2:-anandkrishna.me}" ;;
esac

# The MX records as they stood before the migration.
EXPECTED_MX=("smtp.secureserver.net" "mailstore1.secureserver.net")

bold() { printf '\n\033[1m%s\033[0m\n' "$1"; }
ok()   { printf '  \033[32m✓\033[0m %s\n' "$1"; }
bad()  { printf '  \033[31m✗\033[0m %s\n' "$1"; }
warn() { printf '  \033[33m!\033[0m %s\n' "$1"; }
info() { printf '    %s\n' "$1"; }

# Single token, so word-splitting when unquoted is exactly what we want, and
# there is no empty-array expansion to trip over on bash 3.2 (macOS default).
DIG_AT=""
if [ -n "$NS_DIRECT" ]; then
  DIG_AT="@$NS_DIRECT"
  printf '\033[1mPRE-FLIGHT: querying %s directly\033[0m\n' "$NS_DIRECT"
  info "This reads the Cloudflare zone even though the domain is still"
  info "delegated to GoDaddy. Nothing here affects live traffic."
fi

bold "Mail (MX) — the record that must not be lost"
MX=$(dig +short $DIG_AT MX "$DOMAIN" 2>/dev/null | sed 's/\.$//')
if [ -z "$MX" ]; then
  bad "NO MX RECORDS FOUND."
  if [ -n "$NS_DIRECT" ]; then
    bad "DO NOT change your nameservers yet. Add these in Cloudflare DNS first:"
  else
    bad "Mail to @$DOMAIN is broken. Add these in Cloudflare DNS now:"
  fi
  info "MX  @  smtp.secureserver.net       priority 0"
  info "MX  @  mailstore1.secureserver.net priority 10"
else
  while read -r line; do info "$line"; done <<< "$MX"
  missing=0
  for m in "${EXPECTED_MX[@]}"; do
    grep -qi "$m" <<< "$MX" || { bad "missing: $m"; missing=1; }
  done
  if [ "$missing" -eq 0 ]; then
    ok "both original mail servers present"
    [ -n "$NS_DIRECT" ] && ok "safe to change nameservers at GoDaddy"
  fi
fi

if [ -n "$NS_DIRECT" ]; then
  bold "Web records in the Cloudflare zone"
  for rec in A CNAME; do
    for host in "$DOMAIN" "www.$DOMAIN"; do
      v=$(dig +short $DIG_AT "$rec" "$host" 2>/dev/null | tr '\n' ' ')
      [ -n "$v" ] && info "$rec $host -> $v"
    done
  done
  info "(Pages writes these itself when you add the custom domain.)"
  exit 0
fi

bold "Nameservers"
# The registry is the source of truth. Asking a resolver only tells you what
# that resolver has cached, which conflates "not changed yet" with "changed and
# still propagating" — two situations needing completely different responses.
TLDNS=$(dig +short NS "${DOMAIN##*.}." | head -1)
REGISTRY=$(dig +norecurse @"$TLDNS" NS "$DOMAIN" +noall +authority +answer 2>/dev/null \
  | grep -oE '[a-z0-9.-]+\.(cloudflare|domaincontrol)\.com' | sort -u)
info "at the .${DOMAIN##*.} registry:"
[ -z "$REGISTRY" ] && info "  (no delegation found)" || while read -r n; do info "  $n"; done <<< "$REGISTRY"

LOCAL=$(dig +short NS "$DOMAIN" | sed 's/\.$//' | sort)
info "your resolver currently sees:"
[ -z "$LOCAL" ] && info "  (none)" || while read -r n; do info "  $n"; done <<< "$LOCAL"

if grep -qi "cloudflare" <<< "$REGISTRY"; then
  if grep -qi "cloudflare" <<< "$LOCAL"; then
    ok "delegated to Cloudflare, and your resolver agrees"
  else
    ok "delegated to Cloudflare at the registry — the switch is done"
    warn "your resolver still has the old answer cached; nothing to fix, just wait"
    info "to clear it locally on macOS:"
    info "  sudo dscacheutil -flushcache; sudo killall -HUP mDNSResponder"
  fi
elif grep -qi "domaincontrol" <<< "$REGISTRY"; then
  warn "still delegated to GoDaddy at the registry — the change has NOT been made"
else
  bad "unrecognised delegation"
fi

bold "Web"
for host in "$DOMAIN" "www.$DOMAIN"; do
  code=$(curl -s -o /dev/null -w '%{http_code}' -L --max-time 15 "https://$host" || echo 000)
  server=$(curl -sI -L --max-time 15 "https://$host" 2>/dev/null | grep -i '^server:' | tail -1 | tr -d '\r' | cut -d' ' -f2-)
  if [ "$code" = "200" ]; then ok "https://$host -> 200 ${server:+($server)}"
  else bad "https://$host -> $code"; fi
done

bold "Which site is being served?"
if curl -s -L --max-time 15 "https://$DOMAIN" | grep -q "Lead AI Scientist"; then
  ok "the new site"
else
  warn "still the old Netlify build, or not yet propagated"
fi
