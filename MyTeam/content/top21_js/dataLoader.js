export async function loadData() {
  const res = await fetch("data.json");
  const json = await res.json();
  return json.classifica;
}
