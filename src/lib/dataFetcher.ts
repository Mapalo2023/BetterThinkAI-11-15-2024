export async function fetchData(selectedOptions: string[]) {
  // Mock data fetching logic
  return selectedOptions.map(option => ({
    labels: ['Label1', 'Label2', 'Label3'],
    datasets: [{
      label: option,
      data: [10, 20, 30],
      backgroundColor: ['rgba(75, 192, 192, 0.2)'],
      borderColor: ['rgba(75, 192, 192, 1)'],
      borderWidth: 1
    }]
  }));
}
