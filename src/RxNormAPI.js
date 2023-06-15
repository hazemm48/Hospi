
export const suggestApi = async (url) => {
  let data = await fetch(
    `https://rxnav.nlm.nih.gov/REST/approximateTerm.json?term=${url}`,
    {
      method: "GET",
    }
  )
    .then((res) => res.json())
    .then((data) => data);
  return data;
};

export const getInteractionApi = async (url) => {
  let data = await fetch(
    `https://rxnav.nlm.nih.gov/REST/interaction/list.json?rxcuis=${url}&sources=DrugBank`,
    {
      method: "GET",
    }
  )
    .then((res) => res.json())
    .then((data) => data);
  return data;
};
