const mongoose = require("mongoose");

const employeeSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
  },
  password: {
    type: String,
    required: true,
  },
  mobile: {
    type: String,
    required: true,
    match: [/^\d{10}$/, "Please enter a valid 10-digit mobile number"],
  },
  role: {
    type: String,
    enum: ["superAdmin", "siteAdmin", "technician"],
    required: true,
  },
  skill: {
    type: String,
    required: true,
  },
  // status: {
  //   type: String,
  //   enum: ["Incomplete", "Completed", "Pending", "onHold"],
  //   default: "Incomplete",
  // },
  profilePhoto: {
    imageUrl: {
      type: String,
      unique: true,
      sparse: true,
      default: null,
    },
  },
  activeStatus: {
    type: Number,
    default: 1,
  },
  // employeeId: {
  //   type: String,
  //   required: true,
  //   unique: true, 
  // },
  assignedworks: [
    {
      siteId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "sites",
        default: null,
      },
      works: [
        {
          id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Works",
            default: null,
          },
          assignDate: {
            type: String,
            default: () => Date.now()
          },
          status: {
            type: String,
            enum: ["Incomplete", "Completed", "Pending", "onHold"],
            default: "Incomplete"
          }
        }
      ]
    }
  ]
},
{ timestamps: true }
);

const employeeModel = mongoose.model("employees", employeeSchema);

module.exports = employeeModel;
