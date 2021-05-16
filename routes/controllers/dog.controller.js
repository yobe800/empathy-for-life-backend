const createError = require("http-errors");

const Dog = require("../../models/Dog");
const { uploadPhotoToS3, deletePhotoFromS3 } = require("../../aws/s3");

const getDogs = async (req, res, next) => {
  try {
    const { search, next } = req.query;
    const regExpSearch = new RegExp(search);
    const nextNumber = Number(next) || 0;
    let dogs;

    if (search) {
      dogs = await Dog.find()
      .or([{ name: regExpSearch }, { breed: regExpSearch }])
      .lean();
      dogs.sort((a, b) => b.name > a.name ? -1 : 1);
    } else {
      dogs = await Dog.aggregate([
        { $skip: nextNumber },
        { $limit: 6 },
      ]);
    }

    return res.json({
      message: "ok",
      result: {
        dogs,
        next: nextNumber + dogs.length,
      },
    });
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

    const { photoUrl, photoKey } = await uploadPhotoToS3(name, "dogs/profile", photo);
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
      photo: {
        key: photoKey,
        url: photoUrl,
      },
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

const updateDog = async (req, res, next) => {
  try {
    const { id } = req.params;
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

    const updateDog = {
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
    };

    if (photo.split("data:")[1]) {
      const { photo: { key } } = await Dog.findById(id, "photo", { lean: true });
      await deletePhotoFromS3(key);

      const { photoUrl, photoKey } = await uploadPhotoToS3(name, "dogs/profile", photo);
      updateDog.photo = { url: photoUrl, key: photoKey };
    }

    await Dog.updateOne({ _id: id }, updateDog);

    return res.json({ message: "ok", result: null });
  } catch (err) {
    next(
      createError(500, "failed update a dog", { error: err }),
    );
  }
};

const deleteDog = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { photo: { key } } = await Dog.findById(id, "photo", { lean: true });
    await deletePhotoFromS3(key);
    const result = await Dog.findByIdAndDelete(id);

    return res.json({ message: "ok", result: null });
  } catch (err) {
    next(
      createError(500, "failed delete a dog", { error: err }),
    );
  }
};

const getDogNames = async (req, res, next) => {
  try {
    const dogNames = await Dog.find({}, "name").lean();

    return res.json({ message: "ok", result: dogNames });
  } catch (err) {
    next(
      createError(500, "failed get dog names", { error: err }),
    );
  }
};

module.exports = {
  getDogs,
  addDog,
  getDog,
  updateDog,
  deleteDog,
  getDogNames,
};
