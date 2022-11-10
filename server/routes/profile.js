const express = require("express");
const router = express.Router();
const { auth_jwt } = require("../middleware/auth_jwt");
const { create_profile, get_profile, edit_profile, upload_image } = require("../controllers/profile");
const { validateInput } = require("../middleware/validateInput");

const multer = require('multer')
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get("/", auth_jwt, async (req, res) => {
    const profileId = req.headers.profileid;
    await get_profile(profileId, res);
});

router.post("/", validateInput, auth_jwt, async (req, res) => {
    await create_profile(req, res);
});

router.put("/", validateInput, auth_jwt, async (req, res) => {
    await edit_profile(req, res);
});

router.post("/image-upload", upload.single("file"), async (req, res) => {
    await upload_image(req, res);
});


module.exports = router;