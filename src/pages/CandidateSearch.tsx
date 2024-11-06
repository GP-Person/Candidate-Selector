import { useState, useEffect } from 'react';
import { searchGithub, searchGithubUser } from '../api/API'; 
import { Candidate } from '../interfaces/Candidate.interface';

const CandidateSearch = () => {
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [username, setUsername] = useState(''); 
  const [error, setError] = useState(''); 

  // Fetch a random profile from GitHub
  const fetchRandomCandidate = async () => {
    const users = await searchGithub(); // Fetch random users
    if (users.length > 0) {
      const randomIndex = Math.floor(Math.random() * users.length);
      const randomUser = users[randomIndex]; // Select a random user
      const userData = await searchGithubUser(randomUser.login); // Get detailed user info
      setCandidate(userData);
      setError(''); // Clear any previous errors
    } else {
      setCandidate(null);
    }
  };

  // Save candidate to local storage and to saved list
  const saveCandidate = (candidate: Candidate) => {
    const savedCandidates = JSON.parse(localStorage.getItem('savedCandidates') || '[]');
    savedCandidates.push(candidate);
    localStorage.setItem('savedCandidates', JSON.stringify(savedCandidates));
    fetchRandomCandidate(); // Load a new candidate after saving
  };

  // Skip candidate (simply fetch a new one)
  const skipCandidate = () => {
    fetchRandomCandidate();
  };

  // Search for a specific user
  const handleSearch = async (event: React.FormEvent) => {
    event.preventDefault(); // Prevent form submission
    try {
      const userData = await searchGithubUser(username); 
      if (userData && userData.login) {
        setCandidate(userData); 
        setError(''); 
      } else {
        setError('User not found'); 
        setCandidate(null);
      }
    } catch (err) {
      setError('An error occurred while fetching user'); 
    }
  };

  useEffect(() => {
    fetchRandomCandidate(); 
  }, []);

  return (
    <div style={{ textAlign: 'center', color: 'white', backgroundColor: '#0A1734', padding: '20px' }}>
      <h1>Candidate Search</h1>

      {/* Search bar */}
      <form onSubmit={handleSearch} style={{ marginBottom: '20px' }}>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter GitHub username"
          style={{ padding: '10px', fontSize: '16px' }}
        />
        <button type="submit" style={{ padding: '10px', fontSize: '16px', marginLeft: '10px' }}>Search</button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>} {/* Display error message */}

      {candidate ? (
        <div style={{ display: 'inline-block', maxWidth: '300px', marginTop: '20px', backgroundColor: 'black', color: 'white', borderRadius: '10px' }}>
          <img src={candidate.avatar_url} alt={candidate.login} style={{ width: '100%', borderRadius: '10px 10px 0 0' }} />
          <div style={{ padding: '10px' }}>
            <h2>{candidate.name} <em>({candidate.login})</em></h2>
            <p>Location: {candidate.location}</p>
            <p>Email: {candidate.email}</p>
            <p>Company: {candidate.company}</p>
            <p>Bio: {candidate.bio}</p>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-around', padding: '10px' }}>
            <button onClick={() => skipCandidate()} style={{ backgroundColor: 'red', color: 'white', fontSize: '24px' }}>-</button>
            <button onClick={() => saveCandidate(candidate)} style={{ backgroundColor: 'green', color: 'white', fontSize: '24px' }}>+</button>
          </div>
        </div>
      ) : (
        <p>Loading candidate...</p>
      )}
    </div>
  );
};

export default CandidateSearch;
