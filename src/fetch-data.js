function createFetchDataFn({ data = {}, requiredArgs = [] }) {
  return (args) =>
    new Promise((resolve, reject) => {
      const encounteredFailure = Math.random() < 0;

      const missingFields = requiredArgs.filter(
        (arg) => !(arg in args) || !args[arg]
      );

      setTimeout(() => {
        if (encounteredFailure) {
          reject("500 server error");
        } else if (missingFields.length) {
          reject(`400 missing arguments: ${missingFields.join(", ")}`);
        } else {
          resolve(data);
        }
      }, 2000);
    });
}

export const getUser = createFetchDataFn({
  data: {
    id: "1",
    firstName: "John",
    lastName: "Doe",
    username: "jdoe37",
    email: "jdoe@example.com",
    phone: "1 (322) 223-2343"
  }
});

export const getAccounts = createFetchDataFn({
  data: {
    accounts: [{ name: "Toasters Inc.", id: "1", users: ["1", "2", "7"] }]
  },
  requiredArgs: ["userId"]
});

export const getShipments = createFetchDataFn({
  data: {
    shipments: [
      { id: 1, from: "88323", to: "90210" },
      { id: 2, from: "23452", to: "74523" },
      { id: 3, from: "23461", to: "10001" },
      { id: 4, from: "50058", to: "88567" },
      { id: 5, from: "43724", to: "85034" }
    ]
  },
  requiredArgs: ["accountId"]
});
