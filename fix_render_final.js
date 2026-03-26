import axios from 'axios';

const API_KEY = 'rnd_Ph9Cb2Rd95JtXVuaTQiwQqPZrmQG';
const SERVICE_ID = 'srv-d6u7vdv5r7bs73fsg1vg';

async function finalFix() {
    const payload = {
        serviceDetails: {
            pythonDetails: {
                buildCommand: 'pip install -r requirements.txt',
                startCommand: 'uvicorn api_server:app --host 0.0.0.0 --port $PORT'
            },
            envSpecificDetails: {
                buildCommand: 'pip install -r requirements.txt',
                startCommand: 'uvicorn api_server:app --host 0.0.0.0 --port $PORT'
            }
        }
    };

    try {
        await axios.patch(`https://api.render.com/v1/services/${SERVICE_ID}`, payload, {
            headers: { Authorization: `Bearer ${API_KEY}` }
        });
        console.log('✅ Success! Final patch applied.');
    } catch (error) {
        console.error('❌ Failed:', error.message);
    }
}

finalFix();
