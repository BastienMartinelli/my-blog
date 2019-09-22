---
templateKey: blog-post
title: 'React et les refs : introduction'
date: 2019-09-16T09:46:26.473Z
description: >-
  On ne va pas se mentir, les refs ne sont clairement pas la partie la plus
  simple de React. Elles peuvent s'avérer un allié redoutable si correctement
  maîtrisé. Mais dans le cas contraire, elles ne seront qu'une source de bug et
  de complexité inutile. Essayons de démystifier tout cela.
featuredpost: true
featuredimage: /img/105j5q.jpg
tags:
  - React
---
## Commençons par les bases

*Dans ce premier post nous allons prendre le problème par la base, et voir ce qu'est une ref en React. Tout cela pourra paraître très sommaire, et de nombreux éléments de ce post sont issus de [la doc de React](https://fr.reactjs.org/docs/refs-and-the-dom.html) (assez complète sur le sujet).
Ce post servira cependant d'introductions avant un second, plus terre à terre, sur les pièges à éviter lors de l'utilisation des refs dans nos développements.*

React est une librairie permettant de créer des interfaces utilisateur de manière déclarative. Nous décrivons notre IHM en fonction des données d'entrée de notre application (saisie utilisateur, retour de web service...) et React se charge du sale boulot, à savoir manipuler le DOM pour créer ladite interface.

Il arrive cependant que nous ayons besoin de manipuler nous-même un élément du DOM, que ce soit pour mettre le focus sur un champ, ou encore mesurer la taille d'une div. Là, les choses se compliquent. Comment modifier de manière impérative notre IHM décrite de manière déclarative ?

## Les refs à la rescousse

C'est là que les refs entrent en scène. On va passer assez vite sur la définition d'une ref. La documentation de React est assez claire à ce sujet:

> *Les refs fournissent un moyen d’accéder aux nœuds du DOM ou éléments React créés dans la méthode de rendu.*

C'est exactement ce dont nous avons besoin! Imaginons que j'ai un composant qui fait le rendu d'une div, je peux mettre une ref sur cette div pour accéder et manipuler directement l'élément du DOM. Si je fais de même avec un composant enfant, la ref me permettra d'accéder à l'instance de ce dernier (si c'est un composant classe) et d'appeler par exemple ses méthodes.

## Les refs en dernier recours

Cependant, elles sont à utiliser avec parcimonie. Comme nous l'avons évoqué, avec les refs nous pouvons rapidement nous écarter de la philosophie de React, et retomber dans une approche purement impérative. Et bien que certains problème exigent l'utilisation de ref, celles-ci peuvent tout de même être source de bug, ou simplement de complexité dans notre application.

Par conséquent on choisira toujours l'approche déclarative. En d'autres termes, si un problème peut être réglé avec des props, utilisez des props. On préférera par exemple une prop **open** pour gérer l'ouverture d'un composant plutôt que d'exposer une méthode **open** accessible via une ref sur ce dernier.

## Créer une ref

Il existe 3 manières de créer une ref en React:

* Les refs chaîne de caractère
* les refs objet
* les refs callback

### les refs chaîne de caractère

Il s'agit ici de passer le nom de la ref en chaîne de caractères à la prop ref de mon élément. La ref sera alors accessible via **this.refs**. Cette façon de faire est dépréciée. Si comme moi vous êtes amené à travailler sur un projet avec du vécu qui est plein de ce genre de ref, il est temps de les migrer. Non sans rire, la doc stipule très clairement qu'elles seront retirées de React dans une version future...

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

### les refs objet

Les refs objet sont aujourd'hui très courantes. Il est possible d'en créer via la méthode **createRef** ou le hook **useRef**. Dans les deux cas, cela nous retournera un objet contenant une unique propriété **current**. C'est sur cette propriété que React va greffer notre noeud DOM au montage du composant. Pour cela il nous suffira de passer cet objet à la prop **ref** de l'élément cible.

* Dans un composant class

```jsx
class MonComposant extends Component {
  constructor() {
    super();
    // création d'une ref objet
    this.myRef = React.createRef();
  }

  doSomething() {
    // utilisation de la ref pour
    // focus l’élément
    if (this.myRef.current) {
      this.myRef.current.focus();
    }
  }

  render() {
    // on passe la ref objet à l'input
    return (
      <input
        type="text"
        ref={this.myRef}
      />
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
    // utilisation de la ref pour
    // focus l'élement
    if (myRef.current) {
      myRef.current.focus();
    }
  }

  // on passe la ref objet à l'input
  return (
    <input
      type="text"
      ref={myRef}
    />
  )
}
```

### les refs callback

Pour terminer, il faut savoir que la prop **ref** accepte également une fonction de callback. Au montage du composant React va appeler cette fonction et passer en paramètre le nœud du DOM. A nous ensuite d'en faire bon usage.
Cette façon de faire permet ainsi d'avoir un contrôle plus fin sur l'affectation de cette ref.

* Dans un composant class

```jsx
class MonComposant extends Component {
  constructor() {
    super();
    // création de ma ref
    this.myRef = null;
  }

  doSomething() {
    // utilisation de la ref pour
    // focus l’élément
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
      <input
        type="text"
        ref={this.setMyRef}
      />
    )
  }
```

* Dans un composant fonction

```jsx
function MonComposant() {
  // création de ma ref et de son setter
  const [myRef, setMyRef] = React.useState(null)

  function doSomething() {
    // utilisation de la ref pour
    // focus l’élément
    if (myRef) {
      myRef.focus();
    }
  }

  // on passe le callback à l'élément
  return (
    <input
      type="text"
      ref={setMyRef}
    />
  )
}
```

## Pour résumer

* Les refs permettent d'accéder/manipuler un élément ou composant de manière impérative

* Ne pas abuser des refs, préférer une approche déclarative

* Une ref sur un élément html retourne le noeud du DOM

* Une ref sur un composant class retourne l'instance du composant
* Il existe 3 types de refs
  * Les refs chaîne de caractère sont dépréciés
  * Les refs Objets créées via **createRef** ou **useRef**
  * Les refs callback


## ...Affaire à suivre

On sait maintenant ce qu'est une ref, à quel besoin les refs répondent, et comment créer une ref. Cela devrait laisser encore quelques questions. Nous essaierons d'y répondre dans un prochain post sur les pièges à éviter lors de l'utilisation des refs dans des cas concrets.
