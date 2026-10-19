const express = require('express');
const cors = require('cors');

// La clé est maintenant sécurisée via une variable d'environnement
const stripe = require('stripe')(process.env.STRIPE_KEY); 

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('public')); 

app.post('/create-checkout-session', async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      shipping_address_collection: {
        // Demande l'adresse de livraison pour ces pays
        allowed_countries: ['FR', 'BE', 'CH', 'DZ', 'CA'], 
      },
      line_items: [{
        price_data: {
          currency: 'eur',
          product_data: { name: 'Drapeau Algérien - Qualité Supérieure' },
          unit_amount: 1990, // 19.90 €
        },
        quantity: 1,
      }],
      mode: 'payment',
      // Pense à remplacer "VOTRE_ADRESSE_RENDER" par ton vrai lien
      success_url: 'https://VOTRE_ADRESSE_RENDER.onrender.com/index.html?success=true',
      cancel_url: 'https://VOTRE_ADRESSE_RENDER.onrender.com/index.html?canceled=true',
    });
    res.json({ url: session.url });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Port dynamique pour éviter l'erreur "Application exited early"
const PORT = process.env.PORT || 4242;
app.listen(PORT, () => console.log(`✅ Site en ligne sur le port ${PORT} !`));
