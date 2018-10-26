var orm = require("..");

orm.connect("rqlite://localhost:4005", function (err, db) {
  if (err) throw err;

  var Person = db.define("person", {
    name      : String,
    surname   : String,
    age       : Number, // FLOAT
    male      : Boolean,
    continent : [ "Europe", "America", "Asia", "Africa", "Australia", "Antarctica" ], // ENUM type
    photo     : Buffer, // BLOB/BINARY
    data      : Object // JSON encoded
  }, {
    methods: {
      fullName: function () {
        return this.name + ' ' + this.surname;
      }
    },
    validations: {
      age: orm.enforce.ranges.number(15, undefined, "under-age")
    }
  });

  // add the table to the database
  db.sync(function(err) {
    if (err) throw err;

    // add a row to the person table
    Person.create({ name: "TOTO", surname: "Doe", age: 27, data: { hair_color: 'red'} }, function(err) {
      if (err) throw err;

      // query the person table by surname
      Person.find({ name: "TOTO" }, function (err, people) {
        // SQL: "SELECT * FROM person WHERE surname = 'Doe'"
        if (err) throw err;


        console.log(people[0].data)
        // var items = people.map(function (m) {
        //   return m.serialize()
        // })


        //console.log(people[0].id)
        //console.log(people.values());
        console.log("First person: %s, age %d", people[0].fullName(), people[0].age);

        people[0].age = 16;
        people[0].save(function (err) {
          // err.msg == "under-age";
        });
      });
    });
  });
});
