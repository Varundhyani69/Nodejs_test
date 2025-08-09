const School = require('../models/School');
const schoolValidationSchema = require('../validation/schoolValidation');

exports.addSchool = async (req, res) => {
    try {
        const { error, value } = schoolValidationSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ success: false, error: error.details[0].message });
        }

        const { name, address, latitude, longitude } = value;

        const newSchool = new School({
            name,
            address,
            location: {
                type: 'Point',
                coordinates: [longitude, latitude],
            },
        });

        const savedSchool = await newSchool.save();

        res.status(201).json({ success: true, message: 'School added successfully', data: savedSchool });
    } catch (err) {
        console.error('Error adding school:', err);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
};

exports.listSchools = async (req, res) => {
    try {
        const lat = parseFloat(req.query.latitude);
        const lng = parseFloat(req.query.longitude);

        if (
            Number.isNaN(lat) || lat < -90 || lat > 90 ||
            Number.isNaN(lng) || lng < -180 || lng > 180
        ) {
            return res.status(400).json({ success: false, error: 'Invalid latitude or longitude' });
        }

        const schools = await School.aggregate([
            {
                $geoNear: {
                    near: { type: 'Point', coordinates: [lng, lat] },
                    distanceField: 'distance',
                    spherical: true,
                    distanceMultiplier: 0.001,
                }
            },
            { $sort: { distance: 1 } }
        ]);

        res.json({ success: true, count: schools.length, data: schools });
    } catch (err) {
        console.error('Error listing schools:', err);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
};
