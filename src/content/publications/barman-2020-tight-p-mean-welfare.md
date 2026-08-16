---
title: Tight Approximation Algorithms for $p$-Mean Welfare Under Subadditive Valuations
# Fourth author added: your old site listed only three.
authors: ['Siddharth Barman', 'Umang Bhaskar', 'Anand Krishna', 'Ranjani G. Sundaram']
date: 2020-09-01
venue: ESA 2020
type: conference
summary: An $8n$-approximation for $p$-mean welfare under subadditive valuations, with a matching lower bound showing the guarantee is essentially tight.
links:
  doi: https://doi.org/10.4230/LIPIcs.ESA.2020.11
  arxiv: https://arxiv.org/abs/2005.07370
---

We develop polynomial-time algorithms for the fair and efficient allocation of indivisible goods among $n$ agents that have subadditive valuations over the goods. We first consider the Nash social welfare as our objective and design a polynomial-time algorithm that, in the value oracle model, finds an $8n$-approximation to the Nash optimal allocation. Subadditive valuations include XOS (fractionally subadditive) and submodular valuations as special cases. Our result, even for the special case of submodular valuations, improves upon the previously best known $O(n \log n)$-approximation ratio of Garg et al. (2020).

More generally, we study maximization of $p$-mean welfare. The $p$-mean welfare is parameterized by an exponent term $p \in (-\infty, 1]$ and encompasses a range of welfare functions, such as social welfare $(p = 1)$, Nash social welfare ($p \to 0$), and egalitarian welfare ($p \to -\infty$). We give an algorithm that, for subadditive valuations and any given $p \in (-\infty, 1]$, computes (in the value oracle model and in polynomial time) an allocation with $p$-mean welfare at least $\frac{1}{8n}$ times the optimal.

Further, we show that our approximation guarantees are essentially tight for XOS and, hence, subadditive valuations. We adapt a result of Dobzinski et al. (2010) to show that, under XOS valuations, an $O(n^{1-\varepsilon})$ approximation for the $p$-mean welfare for any $p \in (-\infty, 1]$ (including the Nash social welfare) requires exponentially many value queries; here, $\varepsilon > 0$ is any fixed constant.
