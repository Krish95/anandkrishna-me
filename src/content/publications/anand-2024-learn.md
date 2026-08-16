---
# TODO(anand): venue conflict. You told me AAAI 2026; Adarsh Barik's site lists
# this as UAI 2026 and retitled "Dynamic Regret in Outlier-Oblivious Online
# Optimization using Nonconvex Robust Losses". Confirm venue and title.
title: 'LEARN: An Invex Loss for Outlier Oblivious Robust Online Optimization'
authors: ['Adarsh Barik', 'Anand Krishna', 'Vincent Y. F. Tan']
date: 2024-08-12
venue: AAAI 2026
type: conference
featured: true
summary: A non-convex but invex loss that tolerates an unknown number of corrupted rounds, with tight dynamic regret guarantees and no Lipschitz assumption.
links:
  arxiv: https://arxiv.org/abs/2408.06297
---

We study a robust online convex optimization framework, where an adversary can introduce outliers by corrupting loss functions in an arbitrary number of rounds $k$, unknown to the learner. Our focus is on a novel setting allowing unbounded domains and large gradients for the losses without relying on a Lipschitz assumption. We introduce the Log Exponential Adjusted Robust and iNvex (LEARN) loss, a non-convex (invex) robust loss function to mitigate the effects of outliers and develop a robust variant of the online gradient descent algorithm by leveraging the LEARN loss. We establish tight regret guarantees (up to constants), in a dynamic setting, with respect to the uncorrupted rounds and conduct experiments to validate our theory. Furthermore, we present a unified analysis framework for developing online optimization algorithms for non-convex (invex) losses, utilizing it to provide regret bounds with respect to the LEARN loss, which may be of independent interest.
