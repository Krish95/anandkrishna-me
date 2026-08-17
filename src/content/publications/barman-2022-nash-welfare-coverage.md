---
title: Nash Welfare Guarantees for Fair and Efficient Coverage
# Fourth author added: your old site listed only three.
authors: ['Siddharth Barman', 'Anand Krishna', 'Y. Narahari', 'Soumyarup Sadhukhan']
date: 2022-12-01
venue: WINE 2022
type: conference
summary: A polynomial-time $(18+o(1))$-approximation for Nash social welfare in coverage problems, with a matching APX-hardness result.
links:
  doi: https://doi.org/10.1007/978-3-031-22832-2_15
  arxiv: https://arxiv.org/abs/2207.01970
  # The talk video from your old site, which listed "PDF · Cite · Video" here.
  video: https://drive.google.com/file/d/14H7znegK0vE0-aOFUkDg06msh27qRQDE/view?usp=sharing
---

We study coverage problems in which, for a set of agents and a given threshold $T$, the goal is to select $T$ subsets (of the agents) that, while satisfying combinatorial constraints, achieve fair and efficient coverage among the agents. In this setting, the valuation of each agent is equated to the number of selected subsets that contain it, plus one. The current work utilizes the Nash social welfare function to quantify the extent of fairness and collective efficiency. We develop a polynomial-time $(18+o(1))$-approximation algorithm for maximizing Nash social welfare in coverage instances. Our algorithm applies to all instances wherein, for the underlying combinatorial constraints, there exists an FPTAS for weight maximization. We complement the algorithmic result by proving that Nash social welfare maximization is APX-hard in coverage instances.
