const express = require('express');
const cors = require('cors');
// ATTENTION : Mets ta vraie clé secrète Stripe ci-dessous (sk_live_...)
const stripe = require('stripe')('sk_test_4eC39HqLyjWDarjtT1zdp7dc'); 

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('public')); 

app.post('/create-checkout-session', async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      shipping_address_collection: {
        // On demande l'adresse de livraison pour ces pays
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
      // Remplace "VOTRE_ADRESSE_RENDER" par ton vrai lien Render plus tard
      success_url: 'https://VOTRE_ADRESSE_RENDER.onrender.com/index.html?success=true',
      cancel_url: 'https://VOTRE_ADRESSE_RENDER.onrender.com/index.html?canceled=true',
    });
    res.json({ url: session.url });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// La ligne magique pour que Render ne plante pas :
const PORT = process.env.PORT || 4242;
app.listen(PORT, () => console.log(`✅ Site en ligne sur le port ${PORT} !`));
