function BetPanel({
bets
}) {

return (

<div>

<h2>
Suas Bets
</h2>

{

bets.map(
bet => (

<div
key={bet.outcomeId}
>

{bet.selection}

</div>

)
)

}

</div>

);

}

export default BetPanel;