#!/usr/bin/env bash
# Verifies anandkrishna.me during and after the Cloudflare migration.
#
#   bash scripts/check-dns.sh
#
# The MX check is the one that matters: this domain carries GoDaddy-hosted
# email, and losing those records means losing mail.
set -uo pipefail
DOMAIN="${1:-anandkrishna.me}"

# The MX records as they stood before the migration.
EXPECTED_MX=("smtp.secureserver.net" "mailstore1.secureserver.net")

bold() { printf '\033[1m%s\033[0m\n' "$1"; }
ok()   { printf '  \033[32m✓\033[0m %s\n' "$1"; }
bad()  { printf '  \033[31m✗\033[0m %s\n' "$1"; }
info() { printf '    %s\n' "$1"; }

bold "Nameservers"
NS=$(dig +short NS "$DOMAIN" | sed 's/\.$//' | sort)
[ -z "$NS" ] && bad "none returned" || while read -r n; do info "$n"; done <<< "$NS"
if grep -qi "cloudflare" <<< "$NS"; then ok "on Cloudflare"
elif grep -qi "domaincontrol" <<< "$NS"; then bad "still on GoDaddy (change not propagated yet)"
else bad "unrecognised nameservers"; fi

bold "Mail (MX) — must survive the move"
MX=$(dig +short MX "$DOMAIN" | sed 's/\.$//')
if [ -z "$MX" ]; then
  bad "NO MX RECORDS. Mail to @$DOMAIN is broken. Re-add these in Cloudflare DNS:"
  for m in "${EXPECTED_MX[@]}"; do info "$m"; done
else
  while read -r line; do info "$line"; done <<< "$MX"
  missing=0
  for m in "${EXPECTED_MX[@]}"; do
    grep -qi "$m" <<< "$MX" || { bad "missing: $m"; missing=1; }
  done
  [ "$missing" -eq 0 ] && ok "both original mail servers present"
fi

bold "Web"
for host in "$DOMAIN" "www.$DOMAIN"; do
  code=$(curl -s -o /dev/null -w '%{http_code}' -L --max-time 15 "https://$host" || echo 000)
  server=$(curl -sI -L --max-time 15 "https://$host" 2>/dev/null | grep -i '^server:' | tail -1 | tr -d '\r' | cut -d' ' -f2-)
  if [ "$code" = "200" ]; then ok "https://$host -> 200 ${server:+($server)}"
  else bad "https://$host -> $code"; fi
done

bold "Is it the new site?"
if curl -s -L --max-time 15 "https://$DOMAIN" | grep -q "Lead AI Scientist"; then
  ok "new site is being served"
else
  info "not yet — still the old Netlify build, or not propagated"
fi
