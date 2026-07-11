// Team notification email templates

export interface B2CNotificationData {
  customerName: string
  email: string
  phone: string
  modelInterested?: string
  enquiryType: string
  preferredDealer?: string
  message: string
  submittedAt: string
  cmsUrl?: string
}

export interface B2BNotificationData {
  businessName: string
  businessType: string
  vatNumber: string
  contactName: string
  jobTitle: string
  email: string
  phone: string
  address: string
  city: string
  country: string
  website?: string
  modelsOfInterest: string[]
  estimatedQuantity?: string
  hasShowroom?: boolean
  referralSource?: string
  message?: string
  submittedAt: string
  cmsUrl?: string
}

export interface PartsNotificationData {
  customerName: string
  email: string
  phone: string
  partName: string
  partNumber?: string
  compatibleModel?: string
  bikeYear?: number
  quantityRequired: number
  enquiryType: string
  message?: string
  submittedAt: string
  isB2B?: boolean
  businessName?: string
  cmsUrl?: string
}

export const generateB2CNotificationEmail = (data: B2CNotificationData) => {
  const subject = `New Customer Enquiry - ${data.modelInterested || 'General'} - ${data.customerName}`
  
  const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${subject}</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 800px; margin: 0 auto; padding: 20px; }
        .header { background-color: #1d3557; color: white; padding: 20px; text-align: center; margin-bottom: 20px; }
        .urgent { background-color: #dc3545; color: white; padding: 15px; text-align: center; margin-bottom: 20px; font-weight: bold; }
        .details-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        .details-table th, .details-table td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
        .details-table th { background-color: #f8f9fa; font-weight: bold; color: #1d3557; }
        .details-table tr:hover { background-color: #f5f5f5; }
        .cta { background-color: #e3f2fd; padding: 20px; text-align: center; margin: 20px 0; border-radius: 5px; }
        .cta-button { display: inline-block; background-color: #1d3557; color: white; text-decoration: none; padding: 12px 30px; border-radius: 5px; font-weight: bold; }
        .priority { background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🚨 New B2C Customer Enquiry</h1>
            <p>Action Required: Respond within 24 hours</p>
        </div>
        
        <div class="urgent">
            📞 PRIORITY LEAD - Customer interested in ${data.modelInterested || 'motorcycle enquiry'}
        </div>
        
        <table class="details-table">
            <tr>
                <th>Field</th>
                <th>Value</th>
            </tr>
            <tr>
                <td><strong>Customer Name</strong></td>
                <td>${data.customerName}</td>
            </tr>
            <tr>
                <td><strong>Email Address</strong></td>
                <td><a href="mailto:${data.email}">${data.email}</a></td>
            </tr>
            <tr>
                <td><strong>Phone Number</strong></td>
                <td><a href="tel:${data.phone}">${data.phone}</a></td>
            </tr>
            ${data.modelInterested ? `
            <tr>
                <td><strong>Model Interested</strong></td>
                <td><span style="background-color: #e3f2fd; padding: 5px 10px; border-radius: 3px; font-weight: bold;">${data.modelInterested}</span></td>
            </tr>
            ` : ''}
            <tr>
                <td><strong>Enquiry Type</strong></td>
                <td>${data.enquiryType.charAt(0).toUpperCase() + data.enquiryType.slice(1).replace('-', ' ')}</td>
            </tr>
            ${data.preferredDealer ? `
            <tr>
                <td><strong>Preferred Dealer</strong></td>
                <td>${data.preferredDealer}</td>
            </tr>
            ` : ''}
            <tr>
                <td><strong>Customer Message</strong></td>
                <td style="background-color: #f8f9fa; padding: 10px; border-radius: 3px;">"${data.message}"</td>
            </tr>
            <tr>
                <td><strong>Submitted At</strong></td>
                <td>${new Date(data.submittedAt).toLocaleString('en-GB', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric', 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}</td>
            </tr>
        </table>
        
        <div class="priority">
            <h3>⏰ Response Priority</h3>
            <ul>
                <li><strong>Target Response:</strong> Within 4 hours during business hours</li>
                <li><strong>Maximum Response:</strong> 24 hours</li>
                <li><strong>Follow-up:</strong> Schedule test ride if requested</li>
            </ul>
        </div>
        
        <div class="cta">
            <h3>Quick Actions</h3>
            <a href="${data.cmsUrl || `${process.env.SANITY_STUDIO_URL || 'https://rks.sanity.studio'}/desk/enquiries`}" class="cta-button">View in CMS</a>
            <a href="mailto:${data.email}?subject=Re: Your RKS Enquiry" class="cta-button" style="background-color: #e63946; margin-left: 10px;">Reply to Customer</a>
        </div>
        
        <div style="margin-top: 30px; padding: 20px; background-color: #f8f9fa; border-radius: 5px;">
            <h4>Suggested Response Actions:</h4>
            <ol>
                <li>Call the customer within 4 hours if possible</li>
                <li>Send personalized email with model information</li>
                <li>Arrange test ride at preferred dealer location</li>
                <li>Follow up with pricing and financing options</li>
                <li>Update CMS with call notes and next steps</li>
            </ol>
        </div>
    </div>
</body>
</html>
  `
  
  return { subject, html }
}

export const generatePartsNotificationEmail = (data: PartsNotificationData) => {
  const subject = `${data.isB2B ? '🏢 B2B' : '🛒 B2C'} Parts Enquiry - ${data.partName} ${data.partNumber ? `- ${data.partNumber}` : ''} - ${data.customerName}`
  
  const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${subject}</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 800px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, ${data.isB2B ? '#1d3557' : '#e63946'} 0%, ${data.isB2B ? '#e63946' : '#1d3557'} 100%); color: white; padding: 20px; text-align: center; margin-bottom: 20px; border-radius: 8px; }
        .urgent { background-color: ${data.isB2B ? '#28a745' : '#dc3545'}; color: white; padding: 15px; text-align: center; margin-bottom: 20px; font-weight: bold; border-radius: 5px; }
        .section { margin: 25px 0; }
        .section-title { background-color: #f8f9fa; padding: 12px; margin: 0 0 10px 0; font-weight: bold; color: #1d3557; border-left: 4px solid ${data.isB2B ? '#28a745' : '#e63946'}; }
        .details-table { width: 100%; border-collapse: collapse; margin: 15px 0; }
        .details-table td { padding: 10px; text-align: left; border: 1px solid #ddd; vertical-align: top; }
        .details-table td:first-child { background-color: #f8f9fa; font-weight: bold; width: 200px; }
        .part-highlight { background-color: #e3f2fd; color: #1565c0; padding: 8px 15px; border-radius: 20px; font-weight: bold; display: inline-block; }
        .quantity-badge { background-color: #fff3cd; color: #856404; padding: 5px 12px; border-radius: 15px; font-weight: bold; }
        .cta { background-color: #fff3cd; padding: 20px; text-align: center; margin: 20px 0; border-radius: 5px; border: 1px solid #ffeaa7; }
        .cta-button { display: inline-block; background-color: ${data.isB2B ? '#28a745' : '#e63946'}; color: white; text-decoration: none; padding: 12px 25px; border-radius: 5px; font-weight: bold; margin: 0 5px; }
        .priority { background-color: #d4edda; border-left: 4px solid #28a745; padding: 15px; margin: 20px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🔧 New ${data.isB2B ? 'B2B Bulk' : 'Customer'} Parts Enquiry</h1>
            <p>${data.isB2B ? 'Trade order requiring sales team attention' : 'Standard parts enquiry for customer support'}</p>
        </div>
        
        <div class="urgent">
            ${data.isB2B ? '💼 BULK ORDER' : '🛒 PARTS REQUEST'} - ${data.partName} - Qty: ${data.quantityRequired}
        </div>
        
        <div class="section">
            <h3 class="section-title">${data.isB2B ? '🏢' : '👤'} Customer Information</h3>
            <table class="details-table">
                <tr><td><strong>Customer Name</strong></td><td>${data.customerName}</td></tr>
                ${data.isB2B && data.businessName ? `<tr><td><strong>Business Name</strong></td><td><strong>${data.businessName}</strong></td></tr>` : ''}
                <tr><td><strong>Email Address</strong></td><td><a href="mailto:${data.email}">${data.email}</a></td></tr>
                <tr><td><strong>Phone Number</strong></td><td><a href="tel:${data.phone}">${data.phone}</a></td></tr>
            </table>
        </div>
        
        <div class="section">
            <h3 class="section-title">🔧 Parts Request Details</h3>
            <table class="details-table">
                <tr>
                    <td><strong>Part Name</strong></td>
                    <td><span class="part-highlight">${data.partName}</span></td>
                </tr>
                ${data.partNumber ? `<tr><td><strong>Part Number</strong></td><td><strong>${data.partNumber}</strong></td></tr>` : ''}
                ${data.compatibleModel ? `<tr><td><strong>Compatible Model</strong></td><td>${data.compatibleModel}</td></tr>` : ''}
                ${data.bikeYear ? `<tr><td><strong>Bike Year</strong></td><td>${data.bikeYear}</td></tr>` : ''}
                <tr>
                    <td><strong>Quantity Required</strong></td>
                    <td><span class="quantity-badge">${data.quantityRequired} ${data.quantityRequired === 1 ? 'unit' : 'units'}</span></td>
                </tr>
                <tr><td><strong>Enquiry Type</strong></td><td>${data.enquiryType.charAt(0).toUpperCase() + data.enquiryType.slice(1).replace('-', ' ')}</td></tr>
                ${data.message ? `<tr><td><strong>Customer Message</strong></td><td style="background-color: #f8f9fa; padding: 10px; border-radius: 3px;">"${data.message}"</td></tr>` : ''}
            </table>
        </div>
        
        <div class="section">
            <h3 class="section-title">⏰ Timeline & Priority</h3>
            <table class="details-table">
                <tr><td><strong>Submitted At</strong></td><td>${new Date(data.submittedAt).toLocaleString('en-GB', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric', 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}</td></tr>
                <tr><td><strong>Response Target</strong></td><td><strong style="color: ${data.isB2B ? '#28a745' : '#e63946'};">${data.isB2B ? '2 business days (trade quote)' : '24 hours (availability check)'}</strong></td></tr>
                <tr><td><strong>Priority Level</strong></td><td>${data.isB2B ? '🔥 HIGH - Business Customer' : '⚡ STANDARD - Retail Customer'}</td></tr>
            </table>
        </div>
        
        <div class="priority">
            <h3>🎯 Action Required</h3>
            <ul>
                <li><strong>${data.isB2B ? 'Sales Team:' : 'Parts Team:'}</strong> ${data.isB2B ? 'Prepare customized trade quote with volume pricing' : 'Check stock availability and provide pricing'}</li>
                <li><strong>Stock Check:</strong> Verify availability ${data.isB2B ? 'across distribution network' : 'in main warehouse'}</li>
                <li><strong>Customer Contact:</strong> ${data.isB2B ? 'Call business contact to discuss requirements' : 'Email customer with availability and pricing'}</li>
                ${data.isB2B ? '<li><strong>Quote Preparation:</strong> Include volume discounts and delivery timeline</li>' : '<li><strong>Order Processing:</strong> Prepare for quick order if customer confirms</li>'}
            </ul>
        </div>
        
        <div class="cta">
            <h3>🚀 Quick Actions</h3>
            <a href="${data.cmsUrl || `${process.env.SANITY_STUDIO_URL || 'https://rks.sanity.studio'}/desk/enquiries`}" class="cta-button">View in CMS</a>
            <a href="mailto:${data.email}?subject=Re: Your RKS Parts Enquiry" class="cta-button" style="background-color: #1d3557;">Reply to Customer</a>
            ${data.isB2B ? '<a href="tel:' + data.phone + '" class="cta-button" style="background-color: #6f42c1;">Call Business</a>' : ''}
        </div>
        
        <div style="margin-top: 30px; padding: 25px; background-color: #f8f9fa; border-radius: 8px; border-left: 4px solid ${data.isB2B ? '#28a745' : '#e63946'};">
            <h4>📋 ${data.isB2B ? 'B2B Sales' : 'Parts Team'} Checklist:</h4>
            <ol>
                ${data.isB2B ? `
                <li><strong>Stock Verification:</strong> Check availability across all warehouses and suppliers</li>
                <li><strong>Pricing Calculation:</strong> Apply volume discounts and trade pricing</li>
                <li><strong>Lead Time:</strong> Confirm delivery timeline for requested quantity</li>
                <li><strong>Business Assessment:</strong> Verify trade account status and credit terms</li>
                <li><strong>Quote Generation:</strong> Create formal trade quote with terms</li>
                <li><strong>Contact Customer:</strong> Call within 24 hours to discuss requirements</li>
                <li><strong>Follow-up:</strong> Send detailed quote within 2 business days</li>
                ` : `
                <li><strong>Availability Check:</strong> Confirm stock levels in main warehouse</li>
                <li><strong>Compatibility:</strong> Verify part fits customer's motorcycle model</li>
                <li><strong>Pricing:</strong> Check current retail pricing and any promotions</li>
                <li><strong>Customer Response:</strong> Email availability and pricing within 24 hours</li>
                <li><strong>Order Preparation:</strong> Have part reserved if customer confirms order</li>
                <li><strong>Installation Info:</strong> Provide installation guidance if complex part</li>
                `}
            </ol>
        </div>
    </div>
</body>
</html>
  `
  
  return { subject, html }
}

export const generateB2BNotificationEmail = (data: B2BNotificationData) => {
  const subject = `🔥 NEW B2B Trade Enquiry - ${data.businessName} - ${data.country}`
  
  const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${subject}</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 900px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #1d3557 0%, #e63946 100%); color: white; padding: 25px; text-align: center; margin-bottom: 20px; border-radius: 8px; }
        .urgent { background-color: #28a745; color: white; padding: 15px; text-align: center; margin-bottom: 20px; font-weight: bold; border-radius: 5px; }
        .section { margin: 25px 0; }
        .section-title { background-color: #f8f9fa; padding: 12px; margin: 0 0 10px 0; font-weight: bold; color: #1d3557; border-left: 4px solid #e63946; }
        .details-table { width: 100%; border-collapse: collapse; margin: 15px 0; }
        .details-table td { padding: 10px; text-align: left; border: 1px solid #ddd; vertical-align: top; }
        .details-table td:first-child { background-color: #f8f9fa; font-weight: bold; width: 200px; }
        .models-grid { display: flex; flex-wrap: wrap; gap: 10px; margin: 10px 0; }
        .model-badge { background-color: #e3f2fd; color: #1565c0; padding: 5px 12px; border-radius: 20px; font-size: 14px; }
        .cta { background-color: #fff3cd; padding: 20px; text-align: center; margin: 20px 0; border-radius: 5px; border: 1px solid #ffeaa7; }
        .cta-button { display: inline-block; background-color: #e63946; color: white; text-decoration: none; padding: 12px 25px; border-radius: 5px; font-weight: bold; margin: 0 5px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🏢 New B2B Trade Partner Application</h1>
            <p>High-value business opportunity requiring sales team attention</p>
        </div>
        
        <div class="urgent">
            💼 BUSINESS OPPORTUNITY - ${data.businessType.toUpperCase()} - Est. Volume: ${data.estimatedQuantity || 'TBD'}
        </div>
        
        <div class="section">
            <h3 class="section-title">🏢 Business Information</h3>
            <table class="details-table">
                <tr><td><strong>Business Name</strong></td><td>${data.businessName}</td></tr>
                <tr><td><strong>Business Type</strong></td><td>${data.businessType.charAt(0).toUpperCase() + data.businessType.slice(1)}</td></tr>
                <tr><td><strong>VAT Number</strong></td><td>${data.vatNumber}</td></tr>
                <tr><td><strong>Address</strong></td><td>${data.address}<br>${data.city}, ${data.country}</td></tr>
                ${data.website ? `<tr><td><strong>Website</strong></td><td><a href="${data.website}" target="_blank">${data.website}</a></td></tr>` : ''}
            </table>
        </div>
        
        <div class="section">
            <h3 class="section-title">👨‍💼 Contact Information</h3>
            <table class="details-table">
                <tr><td><strong>Contact Name</strong></td><td>${data.contactName}</td></tr>
                <tr><td><strong>Job Title</strong></td><td>${data.jobTitle}</td></tr>
                <tr><td><strong>Email</strong></td><td><a href="mailto:${data.email}">${data.email}</a></td></tr>
                <tr><td><strong>Phone</strong></td><td><a href="tel:${data.phone}">${data.phone}</a></td></tr>
            </table>
        </div>
        
        <div class="section">
            <h3 class="section-title">🏍️ Business Requirements</h3>
            <table class="details-table">
                <tr>
                    <td><strong>Models of Interest</strong></td>
                    <td>
                        ${data.modelsOfInterest.length > 0 ? 
                          `<div class="models-grid">${data.modelsOfInterest.map(model => `<span class="model-badge">${model}</span>`).join('')}</div>` : 
                          'Not specified'
                        }
                    </td>
                </tr>
                <tr><td><strong>Est. Monthly Quantity</strong></td><td><strong style="color: #e63946;">${data.estimatedQuantity || 'Not specified'}</strong></td></tr>
                <tr><td><strong>Has Showroom</strong></td><td>${data.hasShowroom ? '✅ Yes' : '❌ No'}</td></tr>
                ${data.referralSource ? `<tr><td><strong>Referral Source</strong></td><td>${data.referralSource.charAt(0).toUpperCase() + data.referralSource.slice(1).replace('-', ' ')}</td></tr>` : ''}
                ${data.message ? `<tr><td><strong>Additional Notes</strong></td><td style="background-color: #f8f9fa; padding: 15px; border-radius: 5px;">"${data.message}"</td></tr>` : ''}
            </table>
        </div>
        
        <div class="section">
            <h3 class="section-title">⏰ Application Timeline</h3>
            <table class="details-table">
                <tr><td><strong>Submitted</strong></td><td>${new Date(data.submittedAt).toLocaleString('en-GB', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric', 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}</td></tr>
                <tr><td><strong>Response Due</strong></td><td><strong style="color: #e63946;">${new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB', { 
                  weekday: 'long', 
                  month: 'long', 
                  day: 'numeric' 
                })} (2 business days)</strong></td></tr>
            </table>
        </div>
        
        <div class="cta">
            <h3>🎯 Immediate Actions Required</h3>
            <p><strong>Sales Team: Prepare personalized trade offer within 2 business days</strong></p>
            <a href="${data.cmsUrl || `${process.env.SANITY_STUDIO_URL || 'https://rks.sanity.studio'}/desk/enquiries`}" class="cta-button">View in CMS</a>
            <a href="mailto:${data.email}?subject=Re: Trade Partner Application - ${data.businessName}" class="cta-button" style="background-color: #1d3557;">Reply to Business</a>
        </div>
        
        <div style="margin-top: 30px; padding: 25px; background-color: #f8f9fa; border-radius: 8px; border-left: 4px solid #28a745;">
            <h4>📋 Sales Team Checklist:</h4>
            <ol>
                <li><strong>Review Application:</strong> Assess business compatibility and territory availability</li>
                <li><strong>Prepare Quote:</strong> Create customized pricing based on volume and territory</li>
                <li><strong>Territory Check:</strong> Verify exclusivity and competition in their area</li>
                <li><strong>Credit Assessment:</strong> Research business credibility and financial stability</li>
                <li><strong>Contact Business:</strong> Call within 24 hours to discuss requirements</li>
                <li><strong>Send Offer:</strong> Deliver personalized trade agreement within 48 hours</li>
                <li><strong>Schedule Meeting:</strong> Arrange video call or in-person meeting if promising</li>
            </ol>
        </div>
    </div>
</body>
</html>
  `
  
  return { subject, html }
}