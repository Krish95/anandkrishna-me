---
title: A Sample Efficient Alternating Minimization-based Algorithm for Robust Phase Retrieval
authors: ['Adarsh Barik', 'Anand Krishna', 'Vincent Y. F. Tan']
date: 2024-09-01
venue: In Submission
type: preprint
featured: true
summary: Recovers a signal from magnitude-only measurements under arbitrary corruption, with nearly linear sample complexity and no spectral initialization.
links: {}
---

In this work, we study the robust phase retrieval problem where the task is to recover an unknown signal $\Theta^* \in \mathbb{R}^d$ in the presence of potentially arbitrarily corrupted magnitude-only linear measurements. We propose an alternating minimization approach that incorporates an oracle solver for a non-convex optimization problem as a subroutine. Our algorithm guarantees convergence to $\Theta^*$ and provides an explicit polynomial dependence of the convergence rate on the fraction of corrupted measurements. We then provide an efficient construction of the aforementioned oracle under a sparse arbitrary outliers model and offer valuable insights into the geometric properties of the loss landscape in phase retrieval with corrupted measurements. Our proposed oracle avoids the need for computationally intensive spectral initialization, using a simple gradient descent algorithm with a constant step size and random initialization instead. Additionally, our overall algorithm achieves nearly linear sample complexity, $\mathcal{O}(\mathrm{polylog}(d))$.
