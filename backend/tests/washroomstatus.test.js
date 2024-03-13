const { MongoClient } = require('mongodb');

const mongoURL = "mongodb://127.0.0.1:27017";
const dbName = "GoHereDB";
const SERVER_URL = "http://localhost:4000";

let db;
let client;
let washroomids;

async function connectToMongo() {
  client = await MongoClient.connect(mongoURL);

  try {
    db = client.db(dbName);
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

beforeAll(async () => {
  await connectToMongo();
});

beforeEach(async () => {
    const coll = db.collection("Washrooms");
    try {
        await coll.drop({ }); // reset database
    } catch (error) {
        console.log(error.message);
    }

    const res = await coll.insertMany([{
            times: {
                "Sunday": [],
                "Monday": [],
                "Tuesday": [],
                "Wednesday": [],
                "Thursday": [],
                "Friday": [],
                "Saturday": [],
            }
        },
        {
            times: {
                "Sunday": [{ "start": 540, "end": 1350 }],
                "Monday": [],
                "Tuesday": [],
                "Wednesday": [ { "start": 0, "end": 780 }, { "start": 800, "end": 1350 }],
                "Thursday": [],
                "Friday": [],
                "Saturday": [],
            }
        }
    ]);

    washroomids = Object.values(res.insertedIds);
});

afterAll(async () => {
  await client.close();
});


test("check availability - no times available", async () =>{
    const res = await fetch(`${SERVER_URL}/checkAvailability/${washroomids[0]}?day=0&hr=22&min=35`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });

    const body = await res.json();
    expect(res.status).toBe(200);
    expect(body.response).toBe(false);
});

test("check availability - time available", async () =>{
    const res = await fetch(`${SERVER_URL}/checkAvailability/${washroomids[1]}?day=0&hr=21&min=35`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });

    const body = await res.json();
    expect(res.status).toBe(200);
    expect(body.response).toBe(true);
});

test("get washroom times - empty", async () =>{
    const res = await fetch(`${SERVER_URL}/getWashroomTimes/${washroomids[0]}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });

    const body = await res.json();
    const ev = {
        Sunday: [],
        Monday: [],
        Tuesday: [],
        Wednesday: [],
        Thursday: [],
        Friday: [],
        Saturday: []
    };

    expect(res.status).toBe(200);
    expect(body.response).toEqual(ev);
});

test("get washroom times - empty", async () =>{
    const res = await fetch(`${SERVER_URL}/getWashroomTimes/${washroomids[1]}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });

    const body = await res.json();
    const ev = {
        Sunday: [{ start: '9:00', end: '22:30' }],
        Monday: [],
        Tuesday: [],
        Wednesday: [{ start: '0:00', end: '13:00' }, { start: '13:20', end: '22:30' }],
        Thursday: [],
        Friday: [],
        Saturday: []
    };

    expect(res.status).toBe(200);
    expect(body.response).toEqual(ev);
});

test("get washroom times demo", async () => {
    const res = await fetch(`${SERVER_URL}/checkAvailabilitydemo`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });

    const body = await res.json();
    const ev = {
        Sunday: [],
        Monday: [],
        Tuesday: [],
        Wednesday: [],
        Thursday: [],
        Friday: [],
        Saturday: []
    };

    expect(res.status).toBe(200);
    expect(body.response).toEqual(ev);
});

test("get washroom times demo - empty", async () => {
    try {
        const coll = db.collection("Washrooms");
        await coll.drop({ }); // reset database
    } catch (error) {
        console.log(error.message);
    }

    const res = await fetch(`${SERVER_URL}/checkAvailabilitydemo/`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });

    const body = await res.json();
    const ev = {
        "Sunday": [
            {
                "Start": "15:00",
                "End": "20:00"
            }
        ],
        "Monday": [
            {
                "Start": "9:00",
                "End": "13:00"
            }
        ],
        "Tuesday": [
            {
                "Start": "9:00",
                "End": "13:00"
            }
        ],
        "Wednesday": [
            {
                "Start": "9:00",
                "End": "13:00"
            }
        ],
        "Thursday": [
            {
                "Start": "9:00",
                "End": "13:00"
            }
        ],
        "Friday": [
            {
                "Start": "9:00",
                "End": "13:00"
            }
        ],
        "Saturday": [
            {
                "Start": "9:00",
                "End": "13:00"
            }
        ],
    }

    expect(res.status).toBe(200);
    expect(body.response).toEqual(ev);
});
