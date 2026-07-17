"use client";

import { useEffect, useState } from "react";
import {
  defaultFinancialPartners,
  financialPartnersCmsKey,
  financialPartnersCmsPath,
  parseFinancialPartners,
  type FinancialPartner,
} from "../../lib/financial-partners";

export function FinancialPartnersSection() {
  const [partners, setPartners] = useState<FinancialPartner[]>(defaultFinancialPartners);

  useEffect(() => {
    let disposed = false;
    fetch(`/api/cms/public?path=${encodeURIComponent(financialPartnersCmsPath)}`, { cache: "no-store" })
      .then((response) => response.ok ? response.json() : null)
      .then((result) => {
        const value = result?.fields?.[financialPartnersCmsKey]?.value;
        if (!disposed && value) setPartners(parseFinancialPartners(value));
      })
      .catch(() => undefined);
    return () => { disposed = true; };
  }, []);

  const visiblePartners = partners.filter((partner) => partner.name.trim() && partner.image.trim());
  if (!visiblePartners.length) return null;

  return (
    <section className="section financial-partners-section">
      <div className="container">
        <div className="financial-partners-heading">
          <div>
            <span className="eyebrow">Réseau international</span>
            <h2>Nos partenaires financiers</h2>
          </div>
          <p>Des partenaires établis aux Émirats arabes unis qui contribuent à rapprocher les investisseurs du Golfe des opportunités et projets structurants en Afrique.</p>
        </div>
        <div className="financial-partners-grid">
          {visiblePartners.map((partner) => (
            <article className="financial-partner-card" key={partner.id}>
              <div className="financial-partner-photo">
                <img src={partner.image} alt={partner.alt || `Portrait de ${partner.name}.`} />
                <span>{partner.country}</span>
              </div>
              <div className="financial-partner-copy">
                <small>{partner.role}</small>
                <h3>{partner.name}</h3>
                {partner.description.trim() && <p>{partner.description}</p>}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
