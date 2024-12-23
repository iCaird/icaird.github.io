---
title: $\tau$-tilting theory & the physics of scattering amplitudes - Hugh Thomas
author: Ellis Caird
date: 2024-11-20
tags:
    - posts
    - japan
    - maths
---

1.1) Generic Fan decomposition


Looking at 'generic behaviour' of quiver reps of a fixed dimension vector which roughly means
behaviour that holds off of solutions to polynomial equations i.e. on a Zariski open set inside of $\mathrm{Rep}_Q(\underline{d})$. Exact definition
of 'generic' is still a little elusive; in theory there are many such zariski open subsets(?) which is the
'right' one? Look at $A_2$ first

$A_2: 1 \overset{\alpha}{\longleftarrow} 2$

For $\underline{d} = (1,0)$ we have no real choice but $\mathbb{C} \overset{0}{\longleftarrow} 0$.

For $\underline{d} = (1,1)$ we have two choices up to isomorphism,

$\mathbb{C} \overset{\alpha}{\longleftarrow} \mathbb{C}$ for $\alpha \neq 0$ and
$\mathbb{C} \overset{0}{\longleftarrow} \mathbb{C}$.

The latter is $S_1 \oplus S_2$ and we'll denote the isomorphism class (which is Zariski open) of the former
by $M_{1,1}$.

For $\underline{d} = (1,1)$ we have a choice of a $d \times d$ complex matrix and the generic condition here
is determinant being non-zero in which case we get $M_{1,1}^d$.

For $\underline{d} = (d_1, d_2)$ with $d_1 > d_2$ we are choosing a $d_1 \times d_2$ matrix and the generic choice
here is an injection which subequently will split the rep as $M_{1,1}^{d_2} \oplus S_1^{d_1 - d_2}$. For the other order we will genericall have a surjective that will split as a direct sum of copies of $S_2$ and $M_{1,1}$. This yields a nice summarising picture:

<script type="text/tikz">
    \Large
  \begin{tikzpicture}[color=white,thick,scale=2]
    \draw (0,0) -- (5,5);
    \draw (0,0) -- (0,5);
    \draw (0,0) -- (5,0);
    \filldraw (2,0) circle (2pt) node[anchor=north]{(0,1)};
    \filldraw (0,2) circle (2pt) node[anchor=east]{(1,0)};
    \filldraw (2,2) circle (2pt) node[anchor=east]{(1,1)};
    \node[right] at (5,0) {$S_1$};
    \node[left] at (0,5) {$S_2$};
    \node[right] at (5,5) {$M_{11}$};
    \node[] at (3.5,1.5) {$M_{11}\ S_1$};
    \node[] at (1.5,3.5) {$S_2\ M_{11}$};



  \end{tikzpicture}
</script>

1.2) The Dynkin case

- Dynkin quivers
- Roots systems
- Gabriel's theorem
- $\operatorname{dimExt}^1(X,X)$ = codim of isoclass of X in Rep_Q(d)

Corollaries: 

- Indecomposable's from Gabriel's theorem are rigid
- Unique way to decompose a dim vec into a sum of dim vecs whose generic reps have no extensions between them.

A cone in a real vector space is all non-negative linear combinations of a set of fixed vectors. Relative interior: points in cone but not on any proper face.

A cone is simplicial if the generators of its rays form a basis.

A fan is a collection of cones thats that is closed under taking faces and intersections.

Given a quiver, Q, we define a fan $\Sigma_Q$ where the rays are generated by the positive roots of $Q$ and the cones
are generated by subsets of positive roots corresponding to reps with no extensions between eachother. This cone is simplicial.






