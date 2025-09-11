import formData from 'form-data';
import Mailgun from 'mailgun.js';

// Initialize Mailgun client only if API key is available
let mg: any = null;
if (process.env.MAILGUN_API_KEY && process.env.MAILGUN_DOMAIN) {
  const mailgun = new Mailgun(formData);
  mg = mailgun.client({
    username: 'api',
    key: process.env.MAILGUN_API_KEY,
    domain: process.env.MAILGUN_DOMAIN
  });
}

export const mailgunClient = mg;

export async function sendTrialWelcomeEmail(email: string, name: string, trialEndDate: Date) {
  if (!mg) {
    throw new Error('Mailgun client not initialized. Please check MAILGUN_API_KEY and MAILGUN_DOMAIN environment variables.');
  }
  
  const loginUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/app`;
  
  try {
    const result = await mg.messages.create(process.env.MAILGUN_DOMAIN!, {
      from: `${process.env.MAILGUN_FROM_NAME} <${process.env.MAILGUN_FROM_EMAIL}>`,
      to: [email],
      subject: 'Welkom bij je 14-dagen MindDumper trial! 🧠',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .logo { font-size: 24px; font-weight: bold; color: #007AFF; margin-bottom: 10px; }
            .cta-button { display: inline-block; padding: 12px 24px; background: #007AFF; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0; font-weight: 500; }
            .features { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .feature-item { display: flex; align-items: flex-start; margin: 10px 0; }
            .checkmark { color: #28a745; font-weight: bold; margin-right: 10px; }
            .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 14px; color: #666; }
            .expiry-highlight { background: #fff3cd; padding: 10px; border-left: 4px solid #ffc107; margin: 15px 0; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">🧠 MindDumper</div>
            <h1>Welkom bij je gratis trial!</h1>
          </div>
          
          <p>Hallo <strong>${name}</strong>!</p>
          
          <p>Welkom bij MindDumper! Je 14-dagen gratis trial is nu actief en je hebt volledige toegang tot alle functies.</p>
          
          <div class="expiry-highlight">
            <strong>⏰ Je trial loopt af op: ${trialEndDate.toLocaleDateString('nl-NL', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</strong>
          </div>
          
          <div class="features">
            <h3>Wat kun je verwachten tijdens je trial:</h3>
            <div class="feature-item">
              <span class="checkmark">✓</span>
              <span><strong>Volledige toegang</strong> - Alle premium functies zijn beschikbaar</span>
            </div>
            <div class="feature-item">
              <span class="checkmark">✓</span>
              <span><strong>Onbeperkt brain dumps</strong> - Dump zoveel gedachten als je wilt</span>
            </div>
            <div class="feature-item">
              <span class="checkmark">✓</span>
              <span><strong>Smart triggers</strong> - Organiseer je gedachten automatisch</span>
            </div>
            <div class="feature-item">
              <span class="checkmark">✓</span>
              <span><strong>Geschiedenis</strong> - Al je brain dumps blijven bewaard</span>
            </div>
            <div class="feature-item">
              <span class="checkmark">✓</span>
              <span><strong>Geen creditcard</strong> - Trial stopt automatisch</span>
            </div>
          </div>
          
          <div style="text-align: center;">
            <a href="${loginUrl}" class="cta-button">
              Start je eerste Brain Dump →
            </a>
          </div>
          
          <h3>🚀 Tips om het meeste uit MindDumper te halen:</h3>
          <ol>
            <li><strong>Start meteen</strong> - Begin met een brain dump van alles wat je bezighoudt</li>
            <li><strong>Gebruik triggers</strong> - Laat MindDumper je gedachten automatisch categoriseren</li>
            <li><strong>Maak het een gewoonte</strong> - 5 minuten per dag kan je mentale rust enorm verbeteren</li>
          </ol>
          
          <p>We sturen je een paar dagen voor het einde van je trial een reminder, zodat je kunt beslissen of je wilt upgraden naar de volledige versie.</p>
          
          <p>Veel succes met het organiseren van je gedachten!</p>
          
          <p>Groeten,<br><strong>Team MindDumper</strong></p>
          
          <div class="footer">
            <p><small>Deze email werd verstuurd omdat je je hebt aangemeld voor een MindDumper trial op ${new Date().toLocaleDateString('nl-NL')}.</small></p>
            <p><small>Vragen? Reply gewoon op deze email!</small></p>
          </div>
        </body>
        </html>
      `,
      text: `
        Welkom bij MindDumper, ${name}!
        
        Je 14-dagen gratis trial is nu actief. Je trial loopt af op ${trialEndDate.toLocaleDateString('nl-NL')}.
        
        Tijdens je trial heb je:
        ✓ Volledige toegang tot alle functies
        ✓ Onbeperkt brain dumps maken
        ✓ Smart triggers voor organisatie
        ✓ Volledige geschiedenis
        
        Start je eerste brain dump: ${loginUrl}
        
        Tips:
        1. Begin met een brain dump van alles wat je bezighoudt
        2. Gebruik triggers om gedachten te categoriseren
        3. Maak er een dagelijkse gewoonte van
        
        Groeten,
        Team MindDumper
      `
    });
    
    console.log('✅ Trial welcome email sent successfully:', result);
    return result;
  } catch (error) {
    console.error('❌ Failed to send trial welcome email:', error);
    throw error;
  }
}

export async function sendTrialReminderEmail(email: string, name: string, daysLeft: number) {
  if (!mg) {
    throw new Error('Mailgun client not initialized. Please check MAILGUN_API_KEY and MAILGUN_DOMAIN environment variables.');
  }
  
  const upgradeUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/upgrade`;
  
  try {
    const result = await mg.messages.create(process.env.MAILGUN_DOMAIN!, {
      from: `${process.env.MAILGUN_FROM_NAME} <${process.env.MAILGUN_FROM_EMAIL}>`,
      to: [email],
      subject: `⏰ Nog ${daysLeft} ${daysLeft === 1 ? 'dag' : 'dagen'} van je MindDumper trial`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .logo { font-size: 24px; font-weight: bold; color: #007AFF; margin-bottom: 10px; }
            .cta-button { display: inline-block; padding: 12px 24px; background: #007AFF; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0; font-weight: 500; }
            .urgency-box { background: ${daysLeft === 1 ? '#fff3cd' : '#d4edda'}; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid ${daysLeft === 1 ? '#ffc107' : '#28a745'}; }
            .consequences { background: #f8d7da; padding: 15px; border-radius: 6px; margin: 15px 0; }
            .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 14px; color: #666; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">🧠 MindDumper</div>
            <h1>${daysLeft === 1 ? '🚨 Laatste dag van je trial!' : `⏰ Nog ${daysLeft} dagen van je trial`}</h1>
          </div>
          
          <p>Hallo <strong>${name}</strong>,</p>
          
          <div class="urgency-box">
            <p><strong>Je MindDumper trial loopt over ${daysLeft} ${daysLeft === 1 ? 'dag' : 'dagen'} af.</strong></p>
            ${daysLeft === 1 ? 
              '<p><strong>Dit is je laatste kans</strong> om te upgraden en je brain dump geschiedenis te behouden!</p>' :
              '<p>Wil je blijven gebruikmaken van MindDumper na je trial? Upgrade nu naar de volledige versie.</p>'
            }
          </div>
          
          ${daysLeft === 1 ? `
            <div class="consequences">
              <h3>⚠️ Wat gebeurt er morgen?</h3>
              <ul>
                <li>Je verliest toegang tot de MindDumper app</li>
                <li>Je brain dump geschiedenis wordt gepauzeerd</li>
                <li>Je account blijft bestaan (je kunt later altijd nog upgraden)</li>
              </ul>
            </div>
          ` : `
            <h3>💎 Waarom MindDumper upgraden?</h3>
            <ul>
              <li><strong>Levenslange toegang</strong> - Eenmalige betaling van €49</li>
              <li><strong>Alle data behouden</strong> - Je brain dumps blijven bewaard</li>
              <li><strong>Onbeperkt gebruik</strong> - Zoveel brain dumps als je wilt</li>
              <li><strong>Priority support</strong> - Directe hulp wanneer je die nodig hebt</li>
            </ul>
          `}
          
          <div style="text-align: center;">
            <a href="${upgradeUrl}" class="cta-button">
              Upgrade Nu voor €49 →
            </a>
          </div>
          
          <p><strong>Waarom klanten upgraden:</strong></p>
          <blockquote style="margin: 20px 0; padding: 15px; background: #f8f9fa; border-left: 3px solid #007AFF; font-style: italic;">
            "MindDumper heeft mijn mentale rust enorm verbeterd. De €49 is het beste wat ik ooit heb uitgegeven aan mijn welzijn." - Tevreden gebruiker
          </blockquote>
          
          <p>Heb je vragen over de upgrade? Reply gewoon op deze email!</p>
          
          <p>Groeten,<br><strong>Team MindDumper</strong></p>
          
          <div class="footer">
            <p><small>Je kunt op elk moment upgraden, ook na het einde van je trial. Je account en instellingen blijven bewaard.</small></p>
          </div>
        </body>
        </html>
      `,
      text: `
        Hallo ${name},
        
        Je MindDumper trial loopt over ${daysLeft} ${daysLeft === 1 ? 'dag' : 'dagen'} af.
        
        ${daysLeft === 1 ? 
          'Dit is je laatste dag! Upgrade nu om je brain dumps te behouden.' :
          'Wil je blijven gebruikmaken van MindDumper? Upgrade naar de volledige versie.'
        }
        
        Upgrade voor €49: ${upgradeUrl}
        
        Waarom upgraden?
        • Levenslange toegang
        • Alle data behouden  
        • Onbeperkt gebruik
        • Priority support
        
        Vragen? Reply op deze email!
        
        Groeten,
        Team MindDumper
      `
    });
    
    console.log(`✅ Trial ${daysLeft}-day reminder email sent successfully:`, result);
    return result;
  } catch (error) {
    console.error(`❌ Failed to send trial ${daysLeft}-day reminder email:`, error);
    throw error;
  }
}

export async function sendTrialExpiredEmail(email: string, name: string) {
  if (!mg) {
    throw new Error('Mailgun client not initialized. Please check MAILGUN_API_KEY and MAILGUN_DOMAIN environment variables.');
  }
  
  const upgradeUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/upgrade?discount=LASTCHANCE10`;
  
  try {
    const result = await mg.messages.create(process.env.MAILGUN_DOMAIN!, {
      from: `${process.env.MAILGUN_FROM_NAME} <${process.env.MAILGUN_FROM_EMAIL}>`,
      to: [email],
      subject: '🔚 Je MindDumper trial is verlopen - Laatste kans met 10% korting!',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .logo { font-size: 24px; font-weight: bold; color: #007AFF; margin-bottom: 10px; }
            .cta-button { display: inline-block; padding: 15px 30px; background: #dc3545; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0; font-weight: 500; font-size: 16px; }
            .discount-box { background: linear-gradient(135deg, #ff6b6b, #ee5a24); color: white; padding: 25px; border-radius: 10px; text-align: center; margin: 25px 0; }
            .discount-code { font-size: 24px; font-weight: bold; background: rgba(255,255,255,0.2); padding: 10px 20px; border-radius: 6px; display: inline-block; margin: 10px 0; }
            .urgency { background: #fff3cd; padding: 15px; border-radius: 6px; margin: 15px 0; border-left: 4px solid #ffc107; }
            .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 14px; color: #666; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">🧠 MindDumper</div>
            <h1>Je trial is verlopen 😔</h1>
          </div>
          
          <p>Hallo <strong>${name}</strong>,</p>
          
          <p>Je 14-dagen MindDumper trial is helaas verlopen. We hopen dat je de ervaring waardevol vond!</p>
          
          <div class="discount-box">
            <h2 style="margin-top: 0; color: white;">🎁 Speciale Dank-je-wel Aanbieding</h2>
            <p style="font-size: 18px; margin: 15px 0;">Als dank voor het proberen van MindDumper krijg je <strong>10% korting</strong> als je binnen 48 uur upgrade!</p>
            <div class="discount-code">LASTCHANCE10</div>
            <p style="margin-bottom: 0;"><small>Normale prijs: €49 → Nu: €44,10</small></p>
          </div>
          
          <div class="urgency">
            <p><strong>⏰ Deze aanbieding verloopt over 48 uur!</strong></p>
          </div>
          
          <div style="text-align: center;">
            <a href="${upgradeUrl}" class="cta-button">
              Claim 10% Korting Nu →
            </a>
          </div>
          
          <h3>🤔 Waarom zouden mensen terugkomen naar MindDumper?</h3>
          <ul>
            <li><strong>Mentale rust</strong> - Een helder hoofd door je gedachten te dumpen</li>
            <li><strong>Eenvoudig systeem</strong> - Geen ingewikkelde apps, gewoon brain dumpen</li>
            <li><strong>Levenslange toegang</strong> - Eenmalige betaling, voor altijd toegang</li>
            <li><strong>Privacy</strong> - Jouw gedachten blijven privé en veilig</li>
          </ul>
          
          <p><strong>Mis je MindDumper al?</strong> De meeste mensen merken binnen een paar dagen het verschil zonder hun dagelijkse brain dump routine.</p>
          
          <blockquote style="margin: 20px 0; padding: 15px; background: #f8f9fa; border-left: 3px solid #007AFF; font-style: italic;">
            "Ik merkte al na 3 dagen dat ik MindDumper miste. Mijn hoofd voelde weer vol en chaotisch. De upgrade was de beste beslissing!" - Terugkerende gebruiker
          </blockquote>
          
          <div style="background: #d1ecf1; padding: 15px; border-radius: 6px; margin: 20px 0;">
            <p style="margin: 0;"><strong>💡 Geen haast?</strong> Je account blijft bestaan en je kunt op elk moment upgraden. Maar deze 10% korting krijg je alleen nu!</p>
          </div>
          
          <p>Vragen over de upgrade? Reply gewoon op deze email!</p>
          
          <p>Groeten,<br><strong>Team MindDumper</strong></p>
          
          <div class="footer">
            <p><small>Deze 10% korting is geldig tot ${new Date(Date.now() + 48 * 60 * 60 * 1000).toLocaleDateString('nl-NL')} om ${new Date(Date.now() + 48 * 60 * 60 * 1000).toLocaleTimeString('nl-NL', {hour: '2-digit', minute: '2-digit'})}.</small></p>
            <p><small>Je kunt je op elk moment afmelden voor deze emails door te reageren met 'STOP'.</small></p>
          </div>
        </body>
        </html>
      `,
      text: `
        Hallo ${name},
        
        Je MindDumper trial is verlopen. We hopen dat je de ervaring waardevol vond!
        
        🎁 SPECIALE AANBIEDING: 10% KORTING
        
        Als dank voor het proberen krijg je 10% korting als je binnen 48 uur upgrade.
        
        Gebruik code: LASTCHANCE10
        Normale prijs: €49 → Nu: €44,10
        
        Upgrade: ${upgradeUrl}
        
        Waarom mensen terugkomen:
        • Mentale rust door brain dumpen
        • Eenvoudig en effectief systeem  
        • Levenslange toegang voor €44,10
        • Privacy en veiligheid
        
        Deze aanbieding verloopt over 48 uur!
        
        Vragen? Reply op deze email.
        
        Groeten,
        Team MindDumper
      `
    });
    
    console.log('✅ Trial expired email with discount sent successfully:', result);
    return result;
  } catch (error) {
    console.error('❌ Failed to send trial expired email:', error);
    throw error;
  }
}

export async function sendUpgradeConfirmationEmail(email: string, name: string = 'daar') {
  if (!mg) {
    throw new Error('Mailgun client not initialized. Please check MAILGUN_API_KEY and MAILGUN_DOMAIN environment variables.');
  }
  
  const appUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/app`;
  
  try {
    const result = await mg.messages.create(process.env.MAILGUN_DOMAIN!, {
      from: `${process.env.MAILGUN_FROM_NAME} <${process.env.MAILGUN_FROM_EMAIL}>`,
      to: [email],
      subject: '🎉 Welkom bij MindDumper Pro - Je upgrade is actief!',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .logo { font-size: 24px; font-weight: bold; color: #007AFF; margin-bottom: 10px; }
            .cta-button { display: inline-block; padding: 12px 24px; background: #28a745; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0; font-weight: 500; }
            .success-box { background: #d4edda; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #28a745; text-align: center; }
            .features { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .feature-item { display: flex; align-items: flex-start; margin: 10px 0; }
            .checkmark { color: #28a745; font-weight: bold; margin-right: 10px; }
            .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 14px; color: #666; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">🧠 MindDumper</div>
            <h1>Welkom bij MindDumper Pro! 🎉</h1>
          </div>
          
          <div class="success-box">
            <h2 style="color: #28a745; margin-top: 0;">✅ Je upgrade is succesvol verwerkt!</h2>
            <p style="font-size: 18px; margin-bottom: 0;">Je hebt nu <strong>levenslange toegang</strong> tot alle MindDumper features.</p>
          </div>
          
          <p>Hallo <strong>${name}</strong>,</p>
          
          <p>Bedankt voor je vertrouwen in MindDumper! Je betaling is verwerkt en je hebt nu volledige toegang tot alle premium features.</p>
          
          <div class="features">
            <h3>🚀 Wat je nu hebt:</h3>
            <div class="feature-item">
              <span class="checkmark">✓</span>
              <span><strong>Levenslange toegang</strong> - Geen vervaldatum, gebruik MindDumper zo lang je wilt</span>
            </div>
            <div class="feature-item">
              <span class="checkmark">✓</span>
              <span><strong>Onbeperkt brain dumps</strong> - Dump zoveel gedachten als je nodig hebt</span>
            </div>
            <div class="feature-item">
              <span class="checkmark">✓</span>
              <span><strong>Volledige geschiedenis</strong> - Al je brain dumps blijven voor altijd bewaard</span>
            </div>
            <div class="feature-item">
              <span class="checkmark">✓</span>
              <span><strong>Smart triggers</strong> - Automatische organisatie van je gedachten</span>
            </div>
            <div class="feature-item">
              <span class="checkmark">✓</span>
              <span><strong>Priority support</strong> - Directe hulp via email wanneer nodig</span>
            </div>
            <div class="feature-item">
              <span class="checkmark">✓</span>
              <span><strong>Toekomstige updates</strong> - Gratis toegang tot alle nieuwe features</span>
            </div>
          </div>
          
          <div style="text-align: center;">
            <a href="${appUrl}" class="cta-button">
              Ga naar MindDumper Pro →
            </a>
          </div>
          
          <h3>💡 Tips om het maximale uit MindDumper te halen:</h3>
          <ol>
            <li><strong>Maak er een routine van</strong> - 5-10 minuten per dag brain dumpen werkt het beste</li>
            <li><strong>Wees eerlijk</strong> - Dump alle gedachten, ook de ongemakkelijke</li>
            <li><strong>Gebruik triggers</strong> - Laat MindDumper je helpen patronen te herkennen</li>
            <li><strong>Review regelmatig</strong> - Kijk soms terug naar eerdere brain dumps voor inzichten</li>
          </ol>
          
          <p><strong>Hulp nodig?</strong> Reply gewoon op deze email en we helpen je graag verder!</p>
          
          <p>Nogmaals bedankt voor je vertrouwen in MindDumper. We zijn er van overtuigd dat het een positieve impact op je welzijn zal hebben.</p>
          
          <p>Veel plezier met brain dumpen!</p>
          
          <p>Groeten,<br><strong>Team MindDumper</strong></p>
          
          <div class="footer">
            <p><small>Je hebt levenslange toegang tot MindDumper met het account: ${email}</small></p>
            <p><small>Voor support, reply gewoon op deze email of stuur een bericht naar support@minddumper.com</small></p>
          </div>
        </body>
        </html>
      `,
      text: `
        Welkom bij MindDumper Pro, ${name}!
        
        ✅ Je upgrade is succesvol verwerkt!
        
        Je hebt nu levenslange toegang tot:
        ✓ Onbeperkt brain dumps
        ✓ Volledige geschiedenis  
        ✓ Smart triggers
        ✓ Priority support
        ✓ Toekomstige updates
        
        Ga naar MindDumper Pro: ${appUrl}
        
        Tips:
        1. Maak er een dagelijkse routine van
        2. Wees eerlijk in je brain dumps
        3. Gebruik triggers voor patronen
        4. Review regelmatig je eerdere dumps
        
        Hulp nodig? Reply op deze email!
        
        Veel plezier met brain dumpen!
        
        Groeten,
        Team MindDumper
      `
    });
    
    console.log('✅ Upgrade confirmation email sent successfully:', result);
    return result;
  } catch (error) {
    console.error('❌ Failed to send upgrade confirmation email:', error);
    throw error;
  }
}