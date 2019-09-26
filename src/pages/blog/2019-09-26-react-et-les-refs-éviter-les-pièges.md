---
templateKey: blog-post
title: "React et les refs : éviter les pièges"
date: 2019-09-26T15:21:19.983Z
description: >-
  Lors d'un précédent post, nous avons introduit les refs
  de React. Mais voilà, entre
  la théorie et la pratique il y a un monde, et les refs peuvent parfois nous
  jouer des tours. Nous allons donc aujourd'hui parler de 5 pièges à éviter
  lorsque l'on utilise des refs.
featuredpost: true
featuredimage: /img/indiana.jpg
tags:
  - React
---

Quels sont donc ces pièges à éviter ? On va se lancer dans une liste non exhaustive, qui résulte de vrais problèmes que j'ai pu rencontrer dans mes développements. J'espère donc que ce petit billet vous évitera de perdre du temps à vous arracher inutilement les cheveux !

## 1- Ne pas abuser des refs

On commence doucement avec un point que l'on a déjà évoqué lors du post précédent, mais je pense qu'il est bon de le rappeler. En effet, pas plus tard qu'aujourd'hui voilà que l'on me demande de corriger une anomalie somme toute assez banale: un menu déroulant ne se ferme pas suite à une saisie. Mais voilà ce qui coince: le composant n'est pas contrôlé. L'état d'ouverture du menu est géré en interne du composant et l'api a été conçu de manière à ce que l'on puisse commander son ouverture ou fermeture via des méthodes accessibles depuis sa ref.

Ce genre d'api est à proscrire. Si un parent doit pouvoir contrôler l'état d'un composant enfant, alors ce composant enfant doit être... un composant contrôlé. L’état de ce dernier doit donc lui être passé en props.

Pour résumer:

- une props pour passer l'état: **OUI**

- une ref pour changer l'état interne: **NON**

## 2- Transférer les refs

Imaginons: vous avez développé un composant Input. Il est beau, il est bien testé, il marche à la perfection. Le développeur juste à côté de vous - nous l’appellerons Jean-Gui - décide de l'utiliser. Or Jean-Gui, pour une raison obscure, a besoin d’accéder à l’élément du DOM de cet input et lui affecte donc une ref. Vous entendez alors cet énergumène pester contre votre composant, car la ref qui lui a été retournée est évidemment l’instance du composant class et non l'élément du DOM comme il s'y attendait. Vous voilà bien embêté...

Pour éviter cela, il convient toujours de permettre à l'utilisateur, de placer une ref sur un élément du DOM de votre composant. Pour ce faire, dans un composant class, il suffira de proposer une prop spéciale - inputProps dans notre cas - qui sera transmise au l'élément cible.

```jsx
class Input extends Component {
  render() {
    const { inputRef, value, onChange } = this.props;

    return (
      <input type="text" value={value} onChange={onChange} ref={inputRef} />
    );
  }
}
```

Dans un composant fonction c'est un peu différent. En effet, si placer une ref sur un composant class vous retournera l'instance de ce dernier, placer une ref sur un composant fonction fera juste planter votre application (les fonctions n'ayant pas d'instance). Pour régler le problème il suffira d'utiliser la fonction **forwardRef** de React, qui vous permettra de transmettre la ref passée par le parent directement à l'élément cible.

```jsx
const Input = forwardRef((props, ref) => {
  const { inputRef, value, onChange } = props;

  return <input type="text" value={value} onChange={onChange} ref={ref} />;
});
```

## 3- Utiliser le bon type de ref

S’il existe plusieurs manières de gérer les refs, c’est avant tout pour une raison historique. Mais pas seulement, il est donc important d’utiliser le type de ref adapté à notre besoin. Il y a une différence fondamentale entre les refs objets et callback (je ne parlerai pas des refs chaînes de caractères qui sont dépréciés).
Une ref objet ne déclenche pas de rendu lorsque sa valeur change. Si je pose une ref sur un élément qui n’est visible qu’à la réponse d’un appel asynchrone par exemple, la ref sera initialisé, puis React va plus tard affecter le nœud à la ref, mais sans déclencher de re-render. Le traitement qui en découle ne sera donc pas ré-exécuté.

Nous pouvons illustrer cela avec l’exemple suivant:

```jsx
function asyncCall() {
  return new Promise(res => {
    setTimeout(() => res(), 1000);
  });
}

function AsyncTest() {
  const ref = React.useRef(null);
  const [show, setShow] = React.useState(false);

  React.useEffect(() => {
    asyncCall().then(() => {
      setShow(true);
    });
  }, []);

  if (ref && ref.current) ref.current.focus();

  return show && <input type="text" ref={ref} />;
}
```

Ici mon composant affiche un input au bout d’un traitement d’une seconde. Il focus cet input à chaque rendu. Si j'exécute ce bout de code, je vais bien voir s’afficher mon input, mais celui-ci ne sera pas focus. Car suite à son apparition, React va passer le nœud à la ref, mais sans que cela ne déclenche un rendu.

Dans le second exemple ci-dessous, ma ref va être stocké dans une variable d’état. L’affectation du nœud du DOM à cette variable va re-déclencher un rendu. Mon input s’affiche alors bien au bout d’une seconde avec le focus.

```jsx
function asyncCall() {
  return new Promise(res => {
    setTimeout(() => res(), 1000);
  });
}

function AsyncTest() {
  const [ref, setRef] = React.useState(null);
  const [show, setShow] = React.useState(false);

  React.useEffect(() => {
    asyncCall().then(() => {
      setShow(true);
    });
  }, []);

  if (ref) ref.focus();

  return show && <input type="text" ref={setRef} />;
}
```

Pour résumer

- Si on veut contrôler l’affectation de la ref : Utiliser une ref callback

- Si une ref doit être placé sur un élément non présent au premier rendu : utiliser une ref callback stockée dans une variable d’état

- Si la réaffectation de la ref ne nécessite pas (ou ne doit pas) provoquer de re-render : utiliser une ref objet

## 4- Traiter n'importe quel type de ref

Vous avez bien peaufiné l'api de votre composant, celle-ci pour une raison quelconque, accepte comme props une ref que vous avez besoin de modifier. Mais vous avez manipulé cette dernière comme une ref objet alors que Jean-Gui a décidé de vous passer une ref callback. Or chaque type de ref se manipule différemment:

```jsx
const ref1 = useRef("toto");
const [, ref2] = useState("toto");

// réinitialisation des refs
ref1.current = null;
ref2(null);
```

Vous ne pouvez pas garantir le type de ref qui sera passé par l'utilisateur. Il vous faudra donc pouvoir traiter ref objet et callback de la même manière. Pour vous y aider vous pouvez tout à fait vous servir du snippet suivant:

```jsx
function setRef(ref, value) {
  if (typeof ref === "function") {
    // cas d'une ref callback
    ref(value);
  } else if (ref) {
    // cas d'une ref objet
    ref.current = value;
  }
}
```

Qui vous permettra de gérer les refs de cette manière:

```jsx
const ref1 = useRef("toto");
const [, ref2] = useState("toto");

// réinitialisation des refs
setRef(ref1, null);
setRef(ref2, null);
```

## 5- Ne pas écraser les refs

Depuis quelques temps, je participe à la création d'une librairie de composants. Un certain nombre de nos composants manipulent directement la prop **children**, parfois dans le but d'y ajouter une ref.

Prenons un exemple concret : un composant Tooltip. Notre composant Tooltip va positionner son contenu par rapport au composant enfant. Il aura donc besoin de placer une ref sur ce dernier afin de pouvoir mesurer la taille et position de l'enfant.

Voilà à peu près ce que donnerai un tel composant:

```jsx
<Tooltip content="coucou">
  <Button />
</Tooltip>
```

Seulement voilà, si j'applique sans réfléchir le besoin précédent, je risque d'implémenter mon composant de la manière suivante:

```jsx
function Tooltip({ children }) {
  const ref = useRef(null);

  // ... des traitements

  return React.cloneElement(children, { ref });
}
```

Quel est le problème ici ? Mon tooltip va marcher. Celui-ci place bien sa ref sur l'enfant et fait ce qu’il doit faire. Mais que se passe-t-il si le parent du Tooltip avait lui-même placé une ref sur l'enfant (comme ci-dessous) ? Et bien le Tooltip écrasera cette ref.

```jsx
<Tooltip content="coucou">
  <Button ref={parentRef} />
</Tooltip>
```

Comment donc passer la ref de notre composant sans écraser celle déjà existante ? C'est simple, on va les merger. Pour vous y aider voici un petit snippet bien utile.

```jsx
function useMergeRef(...refs) {
  return React.useMemo(() => {
    // on retourne une fonction qui va setter
    // le noeud passé en paramètre à toutes
    // les refs à merger
    return refValue => {
      refs.forEach(r => {
        // on utilise notre fonction setRef
        setRef(r, refValue);
      });
    };
  }, [refs]);
}
```

Ce hook useMergeRef prend en paramètre des refs, et retourne une ref callback, que je vais pouvoir passer à l'élément. Lorsque React va exécuter notre callback en passant en paramètre le nœud du DOM, celui-ci va transmettre ce nœud à toutes les refs passées en paramètre du hook. Et le tour est joué.
Je peux alors changer l'implémentation de mon tooltip vers quelque chose qui ressemble à ça:

```jsx
function Tooltip({ children }) {
  const ref = useRef(null);
  const mergedRef = useMergeRef(ref, children.ref);

  // ... des traitements

  return React.cloneElement(children, { ref: mergedRef });
}
```

## Pour conclure

La liste n'est surement pas exhaustive, et je penses que les refs nous réservent encore quelques surprise. Mais en gardant ces points à l'esprit, vous pourrez déjà les manipuler bien plus sereinement.
