---
title: "The Calkin-Wilf Tree"
description: "An interesting enumeration of the rationals"
date: "2025-11-15"
draft: false
---

---
## Rational Thoughts

I recently found myself needing to understand the dynamics of the following two rational
functions during my research.[^1] Consider the suggestively named maps $L,R\colon \mathbb{Q} \to \mathbb{Q}$ defined via
<center>

$$L(q) = \frac{q}{1+q},\quad R(q) = q+1.$$

</center>

Perhaps even more suggestively we could let $q = \frac{a}{b}$ and rewrite the definition as

<center>

$$L\left(\frac{a}{b}\right) = \frac{a}{a+b},\quad R\left(\frac{a}{b}\right) = \frac{a+b}{b}.$$

</center>

<center><div id="sketch-container"></div></center>

<script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.7.0/p5.min.js"></script>

<script>
  function sketch(p) {
    p.setup = function() {
      let container = document.getElementById('sketch-container');
      p.createCanvas(400, 400);
    };

    p.draw = function() {
      p.background(220);
      p.fill(0);
      p.circle(p.mouseX, p.mouseY, 50);
    };
  }

  new p5(sketch, 'sketch-container');
</script>

---
[^1]: I'm currently trying to understand the structure of the module category of a
tubular algebra. Regular modules have a notion of 'slope' which is just some 
rational number and determines a whole tubular family. Shrinking functors in the sense of Ringel allow you to pass between tubular families. They thus also act on slopes and the maps L and R are 
the induced maps for my two particular shrinking functors. 

