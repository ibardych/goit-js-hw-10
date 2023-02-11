const params = ['name', 'capital', 'population', 'flags', 'languages'];

export const fetchCountries = countryName => {
  return fetch(
    `https://restcountries.com/v3.1/name/${countryName}?fields=${params.join(
      ','
    )}`
  ).then(response => {
    if (!response.ok) {
      throw new Error(response.status);
    }
    return response.json();
  });
};
