function GameCard({ game }) {

return (

<div>

<h3>
{game.homeTeam}
vs
{game.awayTeam}
</h3>

</div>

);

}

export default GameCard;