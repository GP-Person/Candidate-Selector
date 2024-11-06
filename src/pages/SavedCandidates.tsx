import { useEffect, useState } from 'react';
import { Candidate } from '../interfaces/Candidate.interface';

const SavedCandidates = () => {
  const [savedCandidates, setSavedCandidates] = useState<Candidate[]>([]);

  // Fetch saved candidates from localStorage
  useEffect(() => {
    const savedData = localStorage.getItem('savedCandidates');
    if (savedData) {
      setSavedCandidates(JSON.parse(savedData));
    }
  }, []);

  // Remove a candidate from the saved list
  const removeCandidate = (id: string) => {
    const updatedCandidates = savedCandidates.filter(candidate => candidate.id);
    setSavedCandidates(updatedCandidates);
    localStorage.setItem('savedCandidates', JSON.stringify(updatedCandidates));
  };

  return (
    <div style={{ padding: '20px', backgroundColor: '#0A1734', color: 'white', minHeight: '100vh' }}>
      <h1 style={{ textAlign: 'center' }}>Potential Candidates</h1>
      {savedCandidates.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {savedCandidates.map((candidate: Candidate) => (
            <div
              key={candidate.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                width: '90%',
                maxWidth: '800px',
                margin: '10px 0',
                padding: '10px',
                backgroundColor: 'black',
                color: 'white',
                borderRadius: '10px',
                position: 'relative',
              }}
            >
              {/* Profile Picture */}
              <img
                src={candidate.avatar_url}
                alt={candidate.login}
                style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  marginRight: '15px',
                }}
              />
              {/* Candidate Information */}
              <div style={{ flexGrow: 1 }}>
                <h2>{candidate.name} <em>({candidate.login})</em></h2>
                <p>Location: {candidate.location || 'N/A'}</p>
                <p>Email: {candidate.email || 'N/A'}</p>
                <p>Company: {candidate.company || 'N/A'}</p>
                <p>Bio: {candidate.bio || 'N/A'}</p>
              </div>
              {/* Remove Button */}
              <button
                onClick={() => removeCandidate(candidate.id)}
                style={{
                  backgroundColor: 'red',
                  color: 'white',
                  border: 'none',
                  borderRadius: '50%',
                  width: '30px',
                  height: '30px',
                  fontSize: '20px',
                  cursor: 'pointer',
                  marginLeft: '10px',
                }}
              >
                &ndash;
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p style={{ textAlign: 'center' }}>No saved candidates yet.</p>
      )}
    </div>
  );
};

export default SavedCandidates;
