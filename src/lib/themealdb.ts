export async function getRecetasExternas() {
  const res = await fetch("https://www.themealdb.com/api/json/v1/1/filter.php?c=Dessert");
  const data = await res.json();
  return data.meals;
}
