---
title: Tame algebras arising from surfaces - Daniel Labardini-Fragoso
author: Ellis Caird
date: 2024-12-02 
tags:
    - posts
    - japan
    - maths
---



Lecture 1 overview:

- Some precise definitions of what it means for a f.d. algebra over a field to be finite, tame or wild type.
Followed by the theorem of Drozd that says this is a trichotomy. Some examples.
- Definition of a *gentle* algebra (of the form kQ/I). It is almost entirely combinatorial as given and I should look
up what the motivation behind the definition was (and also what is so 'gentle' about them). Also defined skew-gentle
algebras which seem even weirder.
- Examples include cyclically ordered $\tilde{A_2}$ with a zero relation at every vertex.
- Gentle and skew-gentle algebras are tame. Indecomposable modules can be fully described in terms of strings and bands [BB,CB]
- Jacobian algebras are defined as quotients of the path algebra of a quiver by all cyclic derivatives of a chosen potential.
- There is a notion of mutation due to Derksen-Weyman-Zelevinsky for quivers with potential.
- DWZ mutation preserves the mutation type between the two resulting Jacobian algebras. Some technicality requires
us to really work with the 'complete Jacobian algebra'.[DWZ,G-LF-S]

Lecture 2 overview:

- Defined triangulations of surfaces with marked points and associated a quiver with potential to each such triangulation.
- Flipping arcs to go between triangulations corresponds to DWZ mutation of the corresponding quivers with potental. The catch here is that not every arc in every triangulation can be flipped (the bothersome case being the radius in a self folded triangle).
- We can always flip our way out of such triangulations to "nice" ones which always exist but this is undesirable if you want to emulate cluster behaviour so tagged arcs & triangulations will be the combinatorial tool to plug the gap we will see later.
- Jacobian algebras arising from triangultions where marked points are only on the boundary are gentle and hence tame [ABCP '09].
- [GLFS] If the boundary of the surface is non-empty and it is not a punctured monogon, then the jacobian algebra is skew-gentle and hence tame.
- Some theorem by both Geiss and also Crawley-Boevey about the tameness of some algebras defined by quotient of algebras by images of morphisms of varieties.
- For a surface with boundary, AR-translation of modules can be modelled by "tag switching partial Dehn twists".
- $\tau$-rigidity and $\tau$-tilting pairs are preserved under DWZ mutation (this mutation takes modules of a Jacobian algebra to modules of the mutated algebra).
- If two $\tau$-tilting pairs are related by an AIR mutation, then so are the corresponding DWZ mutated modules as modules over the mutated Jacobian algebra. 
- Get some nice bijections:
    - indecomposable $\tau$-rigid pairs <-> tagged arcs on the corresponding surface
    - $\tau$-tilting pairs <-> tagged triangulations
- And a correspondence between AIR mutation and flips of tagged triangulations.

Lecture 3 overview:

- Some recap of stuff from Charles' course about $\tau$-reduced components of the representation variety and some characterisations.
- Introduced decorated representations as a pair consisting of a module and a sum of indec projectives corresponding to a choice of $\underline{v} \in \mathbb{Z}_{\geq 0}^{Q_0}$
