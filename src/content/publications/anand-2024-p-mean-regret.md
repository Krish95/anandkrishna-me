---
title: $p$-Mean Regret for Stochastic Bandits
authors: ['Anand Krishna', 'Philips George John', 'Vincent Y. F. Tan', 'Adarsh Barik']
date: 2024-12-14
venue: AAAI 2025
type: conference
featured: true
summary: A single UCB-based algorithm that achieves $p$-mean regret bounds across the whole fairness–efficiency spectrum, recovering average and Nash regret as special cases.
links:
  doi: https://ojs.aaai.org/index.php/AAAI/article/view/33976
  arxiv: https://arxiv.org/abs/2412.10751
---

In this work, we extend the concept of the $p$-mean welfare objective from social choice theory to study $p$-mean regret in stochastic multi-armed bandit problems. The $p$-mean regret, defined as the difference between the optimal mean among the arms and the $p$-mean of the expected rewards, offers a flexible framework for evaluating bandit algorithms, enabling algorithm designers to balance fairness and efficiency by adjusting the parameter $p$. Our framework encompasses both average cumulative regret and Nash regret as special cases.

We introduce a simple, unified UCB-based algorithm (Explore-Then-UCB) that achieves novel $p$-mean regret bounds. Our algorithm consists of two phases: a carefully calibrated uniform exploration phase to initialize sample means, followed by the UCB1 algorithm of Auer et al. Under mild assumptions, we prove that our algorithm achieves a $p$-mean regret bound of $\tilde{O}\left(\sqrt{\frac{k}{T^{\frac{1}{2|p|}}}}\right)$ for all $p \leq -1$, where $k$ represents the number of arms and $T$ the time horizon. When $-1 < p < 0$, we achieve a regret bound of $\tilde{O}\left(\sqrt{\frac{k^{1.5}}{T^{\frac{1}{2}}}}\right)$. For the range $0 < p \leq 1$, we achieve a $p$-mean regret scaling as $\tilde{O}\left(\sqrt{\frac{k}{T}}\right)$, which matches the previously established lower bound up to logarithmic factors. This result stems from the fact that the $p$-mean regret of any algorithm is at least its average cumulative regret for $p \leq 1$.

In the case of Nash regret (the limit as $p$ approaches zero), our unified approach differs from prior work of Barman et al., which requires a new Nash Confidence Bound algorithm. Notably, we achieve the same regret bound up to constant factors using our more general method.
