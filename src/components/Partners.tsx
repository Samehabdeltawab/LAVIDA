import { motion } from "motion/react";
import { useLang } from "../LangContext";

interface Partner {
  name: string;
  logo: string;
  url: string;
}

const PARTNERS: Partner[] = [
  {
    name: "Nawy",
    logo: "https://www.nawy.com/favicon-32x32.png",
    url: "https://www.nawy.com/?utm_source=google&utm_medium=cpc&utm_campaign=Nawy_search_brand&utm_adgroup=Nawy_English&utm_term=nawy&utm_acc_id=NjU5LTI5MS04NTky&gad_source=1&gad_campaignid=20298030420&gbraid=0AAAAADRSXELZctmQ35KM0jSjG_0kxW--4&gclid=CjwKCAjwiL7VBhA-EiwAhZi9EKsig8qEyTBKceCMJUrs6X3mN8gcJUmKsGZjzNQ2gI-zh2NoCnEJWhoCBmAQAvD_BwE",
  },
  {
    name: "Kunouz Urban Development",
    logo: "https://scontent.fcai19-4.fna.fbcdn.net/v/t39.30808-6/305238557_112782648321619_2260139075402009369_n.jpg",
    url: "https://www.facebook.com/kunouzrealestate/?locale=ar_AR",
  },
  {
    name: "Elm Developments",
    logo: "https://elm-developments.com/wp-content/uploads/2023/logo.png",
    url: "https://elm-developments.com/elm-%D9%84%D9%84%D8%AA%D8%B7%D9%88%D9%8A%D8%B1-%D8%A7%D9%84%D8%B9%D9%82%D8%A7%D8%B1%D9%8A-%D8%AA%D9%86%D8%B7%D9%84%D9%82-%D8%B1%D8%B3%D9%85%D9%8A%D9%8B%D8%A7-%D9%81%D9%8A-%D8%A7%D9%84%D8%B3/",
  },
];

export default function Partners() {
  const { lang } = useLang();

  return (
    <section id="partners" className="py-20 bg-surface-container-low relative">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="text-center mb-14 space-y-4">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-primary">
            {lang === "ar" ? "شركاؤنا" : "Our Partners"}
          </h2>
          <div className="w-20 h-1.5 bg-secondary mx-auto rounded-full"></div>
          <p className="font-sans text-sm md:text-base text-on-surface-variant max-w-xl mx-auto">
            {lang === "ar"
              ? "نفخر بشراكاتنا مع نخبة من أقوى الشركات العقارية في مصر"
              : "We are proud of our partnerships with a select group of Egypt's strongest real estate developers"}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {PARTNERS.map((partner, index) => (
            <motion.a
              key={partner.name}
              href={partner.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -6, boxShadow: "0 10px 30px -10px rgba(0, 51, 78, 0.15)" }}
              className="bg-white rounded-xl border border-outline-variant/30 shadow-card p-8 flex flex-col items-center justify-center gap-4 transition-all duration-300 cursor-pointer group"
            >
              <div className="h-20 w-full flex items-center justify-center overflow-hidden">
                <img
                  src={partner.logo}
                  alt={partner.name}
                  referrerPolicy="no-referrer"
                  className="max-h-20 max-w-[160px] object-contain grayscale group-hover:grayscale-0 transition-all duration-300"
                />
              </div>
              <span className="font-display text-sm font-semibold text-on-surface-variant group-hover:text-primary transition-colors text-center">
                {partner.name}
              </span>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
