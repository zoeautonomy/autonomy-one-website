// Supabase Email Capture Integration
const SUPABASE_URL = 'https://tmgoawxblabgjohiyzhf.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_T0dhAzBx84-_akTPzkCsLA_z1vQejU4';

// Initialize Supabase Client
const { createClient } = window.supabase;
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function handleEmailSubmit(e) {
  e.preventDefault();
  const email = document.getElementById('email-input').value;
  const btn = e.target.querySelector('button');
  
  if (!email) return;

  // Show loading state
  btn.disabled = true;
  const originalText = btn.textContent;
  btn.textContent = 'Sending...';

  try {
    // Insert into Supabase email_signups table
    const { data, error } = await supabase
      .from('email_signups')
      .insert([
        {
          email: email,
          source: 'website_leadmagnet',
          created_at: new Date().toISOString()
        }
      ])
      .select();

    if (error) throw error;

    // Success state
    btn.textContent = '✓ Check your inbox!';
    btn.style.background = '#1D6B3A';
    
    // Clear form
    document.getElementById('email-input').value = '';
    
    // Reset after 3 seconds
    setTimeout(() => {
      btn.textContent = originalText;
      btn.disabled = false;
      btn.style.background = 'var(--c-accent)';
    }, 3000);

    // Send welcome email via function (you'll need a Supabase Edge Function for this)
    // For now, we'll use a simple HTTP POST to a webhook
    sendWelcomeEmail(email);

  } catch (error) {
    console.error('Error:', error);
    btn.textContent = 'Error — try again';
    btn.disabled = false;
    setTimeout(() => {
      btn.textContent = originalText;
    }, 2000);
  }
}

async function sendWelcomeEmail(email) {
  // This will be handled server-side via email service
  // For now, log it so we can manually send or set up automation
  console.log('Welcome email triggered for:', email);
  
  try {
    await fetch('/api/send-welcome-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
  } catch (e) {
    console.log('Email service not yet configured');
  }
}

function toggleFaq(btn) {
  const item = btn.closest('.faq-item');
  const isOpen = item.classList.contains('open');
  document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
  if (!isOpen) item.classList.add('open');
}
