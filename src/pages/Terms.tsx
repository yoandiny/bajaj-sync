import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Terms = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      <main className="flex-grow pt-32 pb-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Conditions Générales d'Utilisation et de Vente</h1>

          <div className="bg-gray-50 rounded-2xl p-8 md:p-12 border border-gray-100 space-y-8 text-gray-600">

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Objet</h2>
              <p>
                Les présentes conditions générales d'utilisation (CGU) et de vente (CGV) régissent l'utilisation de l'application BajajSync et du service BajajSync Online (dashboard) par YoTech.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Acceptation des conditions</h2>
              <p>
                L'accès à la plateforme BajajSync Online et l'utilisation de l'application mobile BajajSync impliquent l'acceptation pleine et entière des présentes CGU/CGV. Elles constituent le contrat entre YoTech et l'utilisateur.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Description des services</h2>
              <p>
                BajajSync est un écosystème de gestion de flotte comprenant une application mobile (collecte de données, paiements) et un dashboard en ligne pour les propriétaires/gestionnaires (suivi, statistiques, gestion des dettes).
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Licence et Accès</h2>
              <p>
                L'accès aux services BajajSync peut être soumis à l'acquisition d'une licence ou d'un abonnement. L'accès au dashboard BajajSync Online est réservé aux utilisateurs enregistrés et validés par YoTech.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Prix et paiement</h2>
              <p>
                Les tarifs des licences et abonnements BajajSync sont communiqués lors de la signature du contrat de service. Le paiement s'effectue selon les modalités convenues (virement, mobile money).
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Support et maintenance</h2>
              <p>
                YoTech fournit un support technique pour l'écosystème BajajSync via email et WhatsApp. Les mises à jour logicielles sont déployées périodiquement pour améliorer le service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Responsabilités</h2>
              <p>
                YoTech s'efforce d'assurer la disponibilité des services BajajSync Online. Toutefois, YoTech ne peut être tenu responsable des interruptions dues à des problèmes techniques chez l'hébergeur ou à des causes de force majeure. L'utilisateur est responsable de la gestion de ses données et de la confidentialité de ses accès.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Propriété intellectuelle</h2>
              <p>
                BajajSync, BajajSync Online et tous leurs composants (code, design, marques) sont la propriété exclusive de YoTech. Toute reproduction ou modification est strictement interdite.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Protection des données</h2>
              <p>
                Les données collectées par BajajSync sont utilisées exclusivement pour le fonctionnement du service de gestion de flotte. YoTech s'engage à ne pas céder ces données à des tiers sans accord préalable.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Juridiction</h2>
              <p>
                Tout litige relatif à l'utilisation de BajajSync sera soumis aux tribunaux malgaches compétents.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Modification des conditions</h2>
              <p>
                YoTech se réserve le droit de modifier les présentes CGU/CGV à tout moment. Les utilisateurs seront informés des modifications majeures.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Contact</h2>
              <p>
                Pour toute question concernant ces conditions :
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Email : <strong>contact@yotech.mg</strong></li>
                <li>Téléphone : <strong>+261 37 68 727 82</strong></li>
              </ul>
            </section>

          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Terms;
