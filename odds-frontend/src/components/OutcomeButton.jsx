function OutcomeButton({
outcome,
onClick
}) {

return (

<button
onClick={() => onClick(outcome)}
>

{outcome.name}

{outcome.price}

</button>

);

}

export default OutcomeButton;