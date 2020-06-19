const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/test', {useNewUrlParser: true, useUnifiedTopology: true});

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

const usersSchema = {
  userName: String,
  password: String
}

const itemsSchema = {
  descripcion: String,
  cantidad: String,
  precio: String
}

const User = mongoose.model("User", usersSchema);
const Item = mongoose.model("Item", itemsSchema);

//==================================GETS=====================================================

app.get("/", function(req, res){
  res.render("login");
});

app.get("/items", function(req, res){

  Item.find({}, function(err, foundItems){
    if(err){
      console.log(err);
    }else{
      res.render("index", {items:foundItems});
    }
  });

});

app.get("/administrarUsuarios", function(req, res){

  User.find({}, function(err, foundUsers){
    if(err){
      console.log(err);
    }else{
      res.render("usuarios",{users: foundUsers});
    }
  });

});


app.get("/goSignUp", function(req, res){
  res.render("signUp");
});


//==================================POSTS====================================================

app.post("/administrarUsuarios", function(req, res){

  User.find({}, function(err, foundUsers){
    if(err){
      console.log(err);
    }else{
      res.render("usuarios",{users: foundUsers});
    }
  });

});

app.post("/logOut", function(req, res){
  res.redirect("/");
});

app.post("/login", function(req, res){
  const userName = req.body.userName;
  const password = req.body.password;

  console.log(userName);
  console.log(password);

  if((userName==="admin")&&(password==="admin")){

    Item.find({}, function(err, foundItems){
      if(err){
        console.log(err);
      }else{
        res.render("admin", {items:foundItems});
      }
    });

  }else{

    User.findOne({userName: userName, password: password}, function(err, foundUser){
      if(err){
        console.log(err);
        res.redirect("/");
      }else{
        if(foundUser){

          if((foundUser.userName == userName) && (foundUser.password == password)){
            console.log("user found");

            Item.find({}, function(err, foundItems){
              if(err){
                console.log(err);
              }else{
                res.render("index", {items:foundItems});
              }
            });

          }else{
            console.log("not found");
            res.redirect("/");
          }

        }else{
          res.redirect("/");
        }

      }
    });

  }



});

app.post("/signUp", function(req, res){
  const userName = req.body.userName;
  const password = req.body.password;

  console.log(userName);
  console.log(password);

  User.find({userName: userName}, function(err, foundUser){
    if(err){
      console.log(err);
    }else{
      console.log(foundUser);
      if(foundUser != userName){
        console.log("aca");

        const newUser = User({
          userName: userName,
          password: password
        });

        newUser.save();

        res.redirect("/items");
      }
    }

  });
});

app.post("/goSignUp", function(req, res){
  res.redirect("/goSignUp");
});

app.post("/update", function(req, res){
  console.log(req.body.id);
  const id = req.body.id;

  Item.findOne({_id: id}, function(err, foundItem){
    if(err){
      console.log(err);
    }else{
      if(!foundItem){
        console.log("wasnt found");
      }else{
        if(req.body.descripcion){
          foundItem.descripcion = req.body.descripcion;

        }
        if(req.body.cantidad){
          foundItem.cantidad = req.body.cantidad;

        }
        if(req.body.precio){
          foundItem.precio = req.body.precio;

        }
        foundItem.save();
      }
    }
  });

res.redirect("/items");

});

app.post("/deleteUser", function(req, res){
  const userID = req.body.eliminar;
  console.log(userID);

  User.findByIdAndRemove(userID, function(err){
    if(err){
      console.log(err);
    }else{
      console.log("Successfully removed");
    }
  });

  res.redirect("/administrarUsuarios");

});

app.post("/delete", function(req, res){
  const itemID = req.body.eliminar;
  console.log(itemID);

  Item.findByIdAndRemove(itemID, function(err){
    if(err){
      console.log(err);
    }else{
      console.log("Successfully removed");
    }
  });

  res.redirect("/items");

});

app.post("/items", function(req, res){
  const descripcion = req.body.descripcion;
  const cantidad = req.body.cantidad;
  const precio = req.body.precio;

  console.log(descripcion);
  console.log(cantidad);
  console.log(precio);

  const newItem = Item({
    descripcion: descripcion,
    cantidad: cantidad,
    precio: precio
  });

  newItem.save();

  res.redirect("/items");
});

app.listen(3000, function(){
  console.log("listening on port 3000");
});
