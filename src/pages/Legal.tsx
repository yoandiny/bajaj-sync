import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Legal = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      <main className="flex-grow pt-32 pb-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Mentions Légales</h1>
          
          <div className="bg-gray-50 rounded-2xl p-8 md:p-12 border border-gray-100 space-y-8 text-gray-600">
            
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Éditeur du site</h2>
              <p className="mb-2">Le présent site est édité par :</p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Nom de l'entreprise :</strong> YoTech</li>
                <li><strong>Statut juridique :</strong> Entreprise individuelle</li>
                <li><strong>NIF :</strong> 3019398009</li>
                <li><strong>STAT :</strong> 95110112025007309</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Hébergement</h2>
              <p className="mb-2">Le site est hébergé par :</p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Nom de l'hébergeur :</strong> Vercel</li>
                <li><strong>Site web de l'hébergeur :</strong> https://vercel.com</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Propriété intellectuelle</h2>
              <p>
                L'ensemble de ce site relève de la législation malgache et internationale sur le droit d'auteur et la propriété intellectuelle. Tous les droits de reproduction sont réservés, y compris pour les documents téléchargeables et les représentations iconographiques et photographiques.
                La reproduction de tout ou partie de ce site sur un support électronique quel qu'il soit est formellement interdite sauf autorisation expresse de YoTech.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Services BajajSync</h2>
              <p>
                BajajSync et BajajSync Online sont des solutions de gestion de flotte développées et distribuées par YoTech. L'utilisation de ces services est soumise à l'acceptation des Conditions Générales de Vente et d'Utilisation (CGVU). 
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Contact</h2>
              <p>
                Pour toute question ou demande d'information concernant BajajSync, vous pouvez nous contacter :
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Par email : <strong>yoan@yotech.mg</strong></li>
                <li>Par téléphone / WhatsApp : <strong>+261 38 22 093 67 / +261 37 68 727 82</strong></li>
              </ul>
            </section>

          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Legal;
