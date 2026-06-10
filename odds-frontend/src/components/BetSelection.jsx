function BetSelection({
selection,
remove
}) {

return (

<div>

<p>
{selection.selection}
</p>

<button
onClick={remove}
>

X

</button>

</div>

);

}

export default BetSelection;