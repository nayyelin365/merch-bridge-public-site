import type { ReactNode } from "react";
import { company } from "@/data/company";
import { ChatIcon, MailIcon, MapPinIcon, PhoneIcon } from "./Icons";
import styles from "./ContactSection.module.css";

const PENDING = "To be confirmed";

function Item({ icon, label, children }: { icon: ReactNode; label: string; children: ReactNode }) {
  return (
    <li className={styles.item}>
      <span className={styles.icon}>{icon}</span>
      <div>
        <h3 className={styles.label}>{label}</h3>
        <div className={styles.value}>{children}</div>
      </div>
    </li>
  );
}

export default function ContactSection() {
  const { address, email, phone, hours } = company.contact;

  return (
    <section id="contact" className={`section ${styles.section}`} aria-labelledby="contact-title">
      <div className={`container ${styles.layout}`}>
        <div className={styles.intro}>
          <span className="eyebrow">Contact</span>
          <h2 id="contact-title" className="section-title">
            Let&apos;s build a bridge to your next market
          </h2>
          <p className="section-lead">
            For product enquiries, quotations or partnership opportunities, get in touch with our team.
          </p>
        </div>

        <ul className={styles.list}>
          <Item icon={<MapPinIcon />} label="Company Address">
            {address ? <address>{address}</address> : <span className={styles.pending}>{PENDING}</span>}
          </Item>

          <Item icon={<MailIcon />} label="Email">
            {email ? <a href={`mailto:${email}`}>{email}</a> : <span className={styles.pending}>{PENDING}</span>}
          </Item>

          <Item icon={<PhoneIcon />} label="Phone">
            {phone ? (
              <a href={`tel:${phone.replace(/[^\d+]/g, "")}`}>{phone}</a>
            ) : (
              <span className={styles.pending}>{PENDING}</span>
            )}
          </Item>

          <Item icon={<ChatIcon />} label="Business Inquiries">
            <p>
              Tell us the product, quantity and destination market you are interested in, and we will get back to
              you with availability and terms.
            </p>
            {hours && <p className={styles.hours}>{hours}</p>}
          </Item>
        </ul>
      </div>
    </section>
  );
}
