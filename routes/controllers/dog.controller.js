const createError = require("http-errors");

const Dog = require("../../models/Dog");
const imageUploadToS3 = require("../../utils/imageUploadToS3");

const getDogs = async (req, res, next) => {
  try {
    console.log(req.query);
    const { projection } = req.query;

    const dogs = await Dog.find({}, projection).lean();

    return res.json({ message: "ok", result: dogs });
  } catch (err) {
    next(
      createError(500, "failed get dogs", { error: err }),
    );
  }


};

const addDog = async (req, res, next) => {
  try {
    const {
      name,
      gender,
      breed,
      age,
      weight,
      heartWorm: heart_worm,
      neutering,
      entrancedAt: entranced_at,
      adoptionStatus: adoption_status,
      dogCharacter: character,
      description,
      photo,
    } = req.body;

    const location = await imageUploadToS3(name, "dog-profile", photo);
    const newDog = {
      name,
      gender,
      breed,
      age,
      weight,
      heart_worm,
      neutering,
      entranced_at,
      adoption_status,
      character,
      description,
      photo_url: location,
    };
    await Dog.create(newDog);

    return res.json({ message: "ok", result: null });
  } catch (err) {
    next(
      createError(500, "failed add a dog", { error: err }),
    )
  }
};

const getDog = async (req, res, next) => {
  try {
    const { id } = req.params;

    const dog = await Dog.findById(id).lean();

    return res.json({ message: "ok", result: dog });
  } catch (err) {
    next(
      createError(500, "failed get a dog", { error: err }),
    );
  }

};

module.exports = {
  getDogs,
  addDog,
  getDog,
};
