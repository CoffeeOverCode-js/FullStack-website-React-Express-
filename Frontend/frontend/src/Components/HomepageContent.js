import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';

// HomepageContent component to display user-specific information on the homepage
const HomepageContent = ({ homepageData, setHomepageData, setUpdateData, usernames, setUsernames, selectOPT, setSelectOPT }) => {
    const [divisions, setDivisions] = useState([]);
    const [orgUnits, setOrgUnits] = useState([]);
    const [reload, setReload] = useState(0)
    const navigate = useNavigate();


    useEffect(() => {
        const fetchData = async () => {
            try {
                const credentialsID = homepageData.credentialsID;
                // Fetch divisions data
                const divRes = await fetch('http://localhost:8080/getDivisions', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ credentialsID })
                });
                // Fetch organizational units data
                const orgUnitRes = await fetch('http://localhost:8080/getOrgUnits', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ credentialsID })
                })

                // Update state with fetched data
                if (divRes.ok) {
                    const divisions = await divRes.json();
                    setDivisions(divisions);
                }
                if (orgUnitRes.ok) {
                    const orgUnits = await orgUnitRes.json();
                    setOrgUnits(orgUnits)
                }

                // Fetch usernames if the user role is 'Admin User' or 'Management User'
                if (homepageData.roleName === 'Admin User' || homepageData.roleName === 'Management User') {
                    const usernamesRes = await fetch('http://localhost:8080/retrieveAllUsers', {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    })
                    if (usernamesRes.ok) {
                        const usernames = await usernamesRes.json();
                        setUsernames(usernames);
                    }
                }
            } catch (error) {
                console.error('Error fetching divisions:', error);
            }
        };
        // Fetch data when the 'reload' state changes
        fetchData();

    }, [reload]);

    // JSX renders the content
    return (
        <div className="homepage-content">
            <div className="leftSide">
                <h3>User Role: {homepageData.roleName}</h3>
                <div className="divisions-box">
                    <h5>Credentials:</h5>
                    <ul>
                        {divisions.map((division, index) => (
                            <li key={index}>{division}</li>
                        ))}
                    </ul>

                </div>
                <button className="btn btn-dark" onClick={(e) => {
                    e.preventDefault();
                    setUpdateData(prevState => ({
                        ...prevState,
                        collectionName: 'division'
                    }))
                    navigate('/update-form')
                }}>Update</button>
                <button className="btn btn-dark" onClick={(e) => {
                    e.preventDefault();
                    navigate('/add-division')
                }}>Add</button>
                <div className="orgUnits-box">
                    <h5>Org Units</h5>
                    <ul>
                        {orgUnits.map((orgUnit, index) => (
                            <li key={index}>{orgUnit}</li>
                        ))}
                    </ul>
                </div>
                <button className="btn btn-dark" onClick={(e) => {
                    e.preventDefault();
                    setUpdateData(prevState => ({
                        ...prevState,
                        collectionName: 'orgUnit'
                    }))
                    navigate('/update-form')
                }}>Update</button>
                <button className="btn btn-dark" onClick={(e) => {
                    e.preventDefault();
                    navigate('/add-orgunit')
                }}>Add</button>
            </div>
            <div className="rightSide">
                <h2>Cool Tech: Redefining Tech Innovation</h2>
                <hr />
                <p>
                    Cool Tech stands tall amidst the ever-evolving tech sphere as a beacon of innovation and progress. The company’s meteoric rise stems from a core ethos centered on pioneering solutions that redefine industry standards.

                    At the heart of Cool Tech’s success lies an unwavering commitment to innovation. The company fosters a culture that champions creativity, driving its rapid growth and groundbreaking achievements. This culture fuels extensive research and development efforts, enabling Cool Tech not only to keep pace with trends but also to set them.

                    Diversity is a cornerstone of Cool Tech’s success. Their portfolio spans AI, blockchain, IoT, and renewable energy, blending technologies to create comprehensive solutions. Yet, beyond technical expertise, the company emphasizes sustainability and social responsibility. They prioritize eco-friendly solutions and engage in philanthropy to create positive societal impact.

                    The Cool Tech team is a powerhouse of visionaries and creative minds. Their collaborative environment encourages employees to push boundaries and think innovatively. This diverse and inclusive workspace fosters a passion for innovation, empowering employees to think beyond convention.

                    As Cool Tech expands globally, their commitment to excellence remains steadfast. Beyond immediate success, the company aims to shape the tech future by creating tech that empowers, sustains, and transforms. Upholding values of innovation, integrity, and inclusivity, Cool Tech is poised to leave an indelible mark on the tech landscape, inspiring generations to come.
                </p>
                <p>

                </p>
            </div>
        </div>
    )
}

export default HomepageContent;