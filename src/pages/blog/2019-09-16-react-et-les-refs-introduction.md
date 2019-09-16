---
templateKey: blog-post
title: 'React et les refs : introduction'
date: 2019-09-16T09:46:26.473Z
description: >-
  On ne va pas se mentir, les refs ne sont clairement pas la partie la plus
  simple de React. Elle peuvent s'avérer un allié redoutable si correctement
  maîtrisés. Dans le cas contraire elle ne seront qu'une source de bug et de
  complexité inutile. Essayons de démystifier tous cela.
featuredpost: true
featuredimage: /img/105j5q.jpg
tags:
  - React
---
## Commençons par les bases

Dans ce premier post nous allons prendre le problème par la base, et voir ce qu'est une ref en React. Tout cela pourra paraître très sommaire, et de nombreux éléments de ce post se retrouverons dans [la doc de React](https://fr.reactjs.org/docs/refs-and-the-dom.html) (assez complète sur le sujet).
Ce post servira cependant d'introductions avant un second écrit plus terre à terre sur les pièges à éviter lors de l'utilisation des refs dans nos développement.

## Qu'est-ce qu'une ref ?

On va passer assez vite sur la définition d'une ref. La documentation de React est assez claire à ce sujet:

> Les refs fournissent un moyen d’accéder aux nœuds du DOM ou éléments React créés dans la méthode de rendu.

Imaginons que j'ai un composant qui fait le rendu d'une div, je peux mettre une ref sur cette div pour accéder et manipuler directement l'élément du DOM. Si je fais de même avec un composant enfant, la ref me permettra d'accéder à l'instance de ce dernier (si c'est un composant classe) et d'appeler ses méthodes par exemple.

## Les refs en dernier recours

Les refs permettent donc de contrôler un élément de manière impérative. C'est puissant, certe, mais cela va à l'encontre de la philosophie même de React, et peut ajouter une certaine complexité à notre composant. On préférera donc une approche déclarative, ou le rendu de notre composant sera directement déterminé en fonction de ses props.

Il y a tout de même des cas ou les refs s'avèrent incontournable. Par exemple pour contrôler le focus d'un élément (très utile pour implémenter une navigation clavier), ou mesurer la taille d'un nœud du DOM.

Néanmoins, si un problème peut être réglé avec des props, utiliser des props. On préférera par exemple une prop **open** pour gérer l'ouverture d'un composant plutôt que d'exposer une méthode **open** accessible via une ref sur ce dernier.

## Les différents types de refs

Il existe 3 types de ref en React:
* Les ref chaîne de caractère
* les ref objet
* les ref callback

### les ref chaine de caractère

```jsx
class MonComposant extends Component {
  doSomething() {
    this.refs.myRef.focus();
  }

  render() {
    return (
      <input type="text" ref="myRef" />
    )
  }
}
```

Il s'agit ici de passer une chaîne de caractère à la prop ref de mon élément. La ref sera alors accessible via **this.refs**. Cette façon de faire est dépréciée. Si comme moi vous êtes amené à travailler sur un projet avec du vécu qui est plein de ce genre de ref, il est temps de les migrer. Non sans rire, la doc stipule bien qu'elles seront retiré de React dans une version future...

### les refs objet

Les refs objet sont aujourd'hui très courante. Il est possible d'en créer via la méthode **createRef** ou le hook **useRef**. Dans les deux cas, cela nous retournera un objet contenant une unique propriété **current**. C'est sur cette propriété que React va greffer notre noeud DOM au montage du composant. Il suffira ensuite de passer cet objet à la prop **ref** de l'élément cible.

* Dans un composant class

```jsx
class MonComposant extends Component {
  constructor() {
    super();
    // création d'une ref objet
    this.myRef = React.createRef();
  }

  doSomething() {
    // utilisation de la ref pour focus l’élément
    if (this.myRef.current) {
      this.myRef.current.focus();
    }
  }

  render() {
    // on passe la ref objet à l'input
    return (
      <input type="text" ref={this.myRef} />
    )
  }
}
```

* dans un composant fonction

```jsx
function MonComposant() {
  // création d'une ref objet
  const myRef= React.useRef();

  function doSomething() {
    // utilisation de la ref pour focus l'élement
    if (myRef.current) {
      myRef.current.focus();
    }
  }

  // on passe la ref objet à l'input
  return (
    <input type="text" ref={myRef} />
  )
}
```

### les refs callback

Pour terminer, il faut savoir que la prop **ref** accepte également une fonction de callback. Au montage du composant React va appeler cette fonction et passer en paramètre le nœud du DOM. A nous par la suite dans faire ce que bon nous semble.
Cette façon de faire permet d'avoir un contrôle plus fin sur l'affectation de cette ref.

* Dans un composant class

```jsx
class MonComposant extends Component {
  constructor() {
    super();
    // création de ma ref
    this.myRef = null;
  }

  doSomething() {
    // utilisation de la ref pour focus l’élément
    if (this.myRef) {
      this.myRef.focus();
    }
  }

  // callback permettant de setter la ref
  setMyRef = (node) => {
    this.myRef = node;
  }

  render() {
    // on passe le callback à l'élément
    return (
      <input type="text" ref={this.setMyRef} />
    )
  }
```

* Dans un composant fonction

```jsx

function MonComposant() {
  // création de ma ref et de son setter
  const [myRef, setMyRef] = React.useState(null)

  function doSomething() {
    // utilisation de la ref pour focus l’élément
    if (myRef) {
      myRef.focus();
    }
  }

  // on passe le callback à l'élément
  return (
    <input type="text" ref={setMyRef} />
  )
}
```

## ...Affaire à suivre

Voilà pour la petite introduction sur les refs. Dans le prochain post nous allons essayer d'aller un peut plus en avant en parlant des pièges à éviter lors de l'utilisation des refs dans des cas concrets.


