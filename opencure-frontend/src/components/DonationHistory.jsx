export default function DonationHistory({ donations, loading }) {
  if (loading) {
    return (
      <div style={styles.loading}>
        Loading donation history...
      </div>
    );
  }

  if (!donations || donations.length === 0) {
    return (
      <div style={styles.empty}>
        <p style={styles.emptyText}>
          💝 No donations yet. Be the first to support this research!
        </p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h3 style={styles.title}>
          Recent Donations ({donations.length})
        </h3>
      </div>

      <div style={styles.list}>
        {donations.slice(0, 10).map((donation, index) => (
          <div key={index} style={styles.item}>
            <div style={styles.itemHeader}>
              <div style={styles.donor}>
                <div style={styles.avatar}>
                  {donation.donor.slice(2, 4).toUpperCase()}
                </div>
                <div>
                  <div style={styles.donorAddress}>
                    {donation.donor.slice(0, 6)}...{donation.donor.slice(-4)}
                  </div>
                  <a 
                    href={`https://sepolia.etherscan.io/tx/${donation.transactionHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={styles.txLink}
                  >
                    View transaction ↗
                  </a>
                </div>
              </div>
              
              <div style={styles.amount}>
                ${parseFloat(donation.amount).toLocaleString()}
              </div>
            </div>
          </div>
        ))}
      </div>

      {donations.length > 10 && (
        <div style={styles.footer}>
          <p style={styles.footerText}>
            Showing 10 of {donations.length} donations
          </p>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    width: '100%',
  },
  loading: {
    padding: '2rem',
    textAlign: 'center',
    color: '#757575',
  },
  empty: {
    padding: '3rem 2rem',
    textAlign: 'center',
    background: '#F5F5F5',
    borderRadius: '8px',
  },
  emptyText: {
    color: '#616161',
    margin: 0,
  },
  
  header: {
    marginBottom: '1rem',
  },
  title: {
    fontSize: '1.25rem',
    color: '#0f2027',
    margin: 0,
  },
  
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  item: {
    background: '#F9F9F9',
    padding: '1rem',
    borderRadius: '8px',
    border: '1px solid #E0E0E0',
  },
  itemHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  
  donor: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  avatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    fontSize: '0.85rem',
  },
  donorAddress: {
    fontFamily: 'monospace',
    fontSize: '0.9rem',
    color: '#424242',
    marginBottom: '0.25rem',
  },
  txLink: {
    fontSize: '0.75rem',
    color: '#FF9800',
    textDecoration: 'none',
  },
  
  amount: {
    fontSize: '1.25rem',
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  
  footer: {
    marginTop: '1rem',
    padding: '1rem',
    textAlign: 'center',
    borderTop: '1px solid #E0E0E0',
  },
  footerText: {
    fontSize: '0.85rem',
    color: '#757575',
    margin: 0,
  },
};