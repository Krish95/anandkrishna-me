---
title: Sublinear Approximation Algorithm for Nash Social Welfare with XOS Valuations
authors: ['Siddharth Barman', 'Anand Krishna', 'Pooja Kulkarni', 'Shivika Narang']
date: 2023-09-01
venue: ITCS 2024
type: conference
summary: Breaks the $O(n)$-approximation barrier for Nash social welfare under XOS valuations, using demand and XOS oracles.
links: {}
---

We study the problem of allocating indivisible goods among $n$ agents with the objective of maximizing Nash social welfare (NSW). This welfare function is defined as the geometric mean of the agents' valuations and, hence, it strikes a balance between the extremes of social welfare (arithmetic mean) and egalitarian welfare (max-min value). Nash social welfare has been extensively studied in recent years for various valuation classes. In particular, a notable negative result is known when the agents' valuations are complement-free and are specified via value queries: for XOS valuations, one necessarily requires exponentially many value queries to find any sublinear (in $n$) approximation for NSW. Indeed, this lower bound implies that stronger query models are needed for finding better approximations.

Towards this, we utilize demand oracles and XOS oracles; both of these query models are standard and have been used in prior work on social welfare maximization with XOS valuations. We develop the first sublinear approximation algorithm for maximizing Nash social welfare under XOS valuations, specified via demand and XOS oracles. Hence, this work breaks the $O(n)$-approximation barrier for NSW maximization under XOS valuations. We obtain this result by developing a novel connection between NSW and social welfare under a capped version of the agents' valuations. In addition to this insight, which might be of independent interest, this work relies on an intricate combination of multiple technical ideas, including the use of repeated matchings and the discrete moving knife method.
