const express = require('express');
const cors = require('cors');
const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');
const { degrees } = require('pdf-lib');
const app = express();
const PORT = 3001;

// Middleware
app.use(cors({
  origin:"*",
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));

// Store for user sessions (in production, use a proper database)
const userSessions = new Map();

// PDF Templates
const createWillTemplate = async (data) => {
  try {
    const pdfDoc = await PDFDocument.create();
    let page = pdfDoc.addPage([612, 792]); // 8.5x11 inches
    const font = await pdfDoc.embedFont(StandardFonts.TimesRoman);
    const boldFont = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);
    
    const { width, height } = page.getSize();
    let yPosition = height - 60;
    
    // Header
    page.drawText('LAST WILL AND TESTAMENT', {
      x: width / 2 - 120,
      y: yPosition,
      size: 18,
      font: boldFont,
      color: rgb(0, 0, 0),
    });
    
    yPosition -= 50;
    
    // Content
    const content = [
      `I, ${data.fullName || 'N/A'}, of ${data.address || 'N/A'}, being of sound mind and disposing memory,`,
      `do hereby make, publish, and declare this to be my Last Will and Testament.`,
      ``,
      `Date of Birth: ${data.dateOfBirth || 'N/A'}`,
      `Date of Execution: ${data.executionDate || 'N/A'}`,
      ``,
      `ARTICLE I - REVOCATION`,
      `I hereby revoke all prior wills and codicils made by me.`,
      ``,
      `ARTICLE II - BENEFICIARIES`,
      `I give, devise, and bequeath my estate to the following beneficiaries:`,
      `${data.beneficiaries || 'N/A'}`,
      ``,
      `ARTICLE III - EXECUTOR`,
      `I hereby nominate and appoint ${data.executor || 'N/A'} as the Executor of this Will.`,
      `Address: ${data.executorAddress || 'N/A'}`,
      `Phone: ${data.executorPhone || 'N/A'}`,
      ``,
      `ARTICLE IV - SPECIAL INSTRUCTIONS`,
      `${data.specialInstructions || 'No special instructions provided.'}`,
      ``,
      `ARTICLE V - WITNESS REQUIREMENTS`,
      `${data.witnessRequired || 'Standard witness requirements apply.'}`,
      ``,
      `IN WITNESS WHEREOF, I have hereunto set my hand this ${data.executionDate || 'N/A'}.`,
      ``,
      ``,
      `_________________________`,
      `${data.fullName || 'N/A'}, Testator`,
      ``,
      ``,
      `WITNESSES:`,
      ``,
      `_________________________    _________________________`,
      `Witness 1 Signature           Witness 2 Signature`,
      ``,
      `_________________________    _________________________`,
      `Print Name                    Print Name`,
    ];
    
    content.forEach((line) => {
      if (yPosition < 60) {
        // Add new page if needed
        const newPage = pdfDoc.addPage([612, 792]);
        yPosition = newPage.getSize().height - 60;
        page = newPage;
      }
      
      const fontSize = line.startsWith('ARTICLE') ? 12 : 11;
      const textFont = line.startsWith('ARTICLE') ? boldFont : font;
      
      page.drawText(line, {
        x: 60,
        y: yPosition,
        size: fontSize,
        font: textFont,
        color: rgb(0, 0, 0),
      });
      
      yPosition -= fontSize + 4;
    });
    
    return pdfDoc;
  } catch (error) {
    console.error('Error creating will template:', error);
    throw error;
  }
};

const createPoATemplate = async (data) => {
  try {
    const pdfDoc = await PDFDocument.create();
    let page = pdfDoc.addPage([612, 792]);
    const font = await pdfDoc.embedFont(StandardFonts.TimesRoman);
    const boldFont = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);
    
    const { width, height } = page.getSize();
    let yPosition = height - 60;
    
    // Header
    page.drawText('POWER OF ATTORNEY', {
      x: width / 2 - 100,
      y: yPosition,
      size: 18,
      font: boldFont,
      color: rgb(0, 0, 0),
    });
    
    yPosition -= 50;
    
    // Content
    const content = [
      `KNOW ALL MEN BY THESE PRESENTS:`,
      ``,
      `I, ${data.principalName || 'N/A'}, of ${data.principalAddress || 'N/A'}, being of sound mind,`,
      `do hereby constitute and appoint ${data.attorneyName || 'N/A'} of ${data.attorneyAddress || 'N/A'}`,
      `as my true and lawful Attorney-in-Fact.`,
      ``,
      `PRINCIPAL INFORMATION:`,
      `Name: ${data.principalName || 'N/A'}`,
      `Address: ${data.principalAddress || 'N/A'}`,
      `Phone: ${data.principalPhone || 'N/A'}`,
      `Date of Birth: ${data.principalDOB || 'N/A'}`,
      ``,
      `ATTORNEY-IN-FACT INFORMATION:`,
      `Name: ${data.attorneyName || 'N/A'}`,
      `Address: ${data.attorneyAddress || 'N/A'}`,
      `Phone: ${data.attorneyPhone || 'N/A'}`,
      ``,
      `SCOPE OF AUTHORITY:`,
      `${data.scopeOfAuthority || 'N/A'}`,
      ``,
      `EFFECTIVE DATE:`,
      `This Power of Attorney shall become effective on ${data.effectiveDate || 'N/A'}.`,
      ``,
      `DURATION:`,
      `${data.duration || 'N/A'}`,
      ``,
      `IN WITNESS WHEREOF, I have executed this Power of Attorney on ${data.effectiveDate || 'N/A'}.`,
      ``,
      ``,
      `_________________________`,
      `${data.principalName || 'N/A'}, Principal`,
      ``,
      ``,
      `NOTARIZATION:`,
      ``,
      `State of: _________________`,
      `County of: ________________`,
      ``,
      `On this _____ day of _________, 20__, before me personally appeared`,
      `${data.principalName || 'N/A'}, who proved to me on the basis of satisfactory`,
      `evidence to be the person whose name is subscribed to the within instrument`,
      `and acknowledged to me that he/she executed the same in his/her authorized`,
      `capacity, and that by his/her signature on the instrument the person, or the`,
      `entity upon behalf of which the person acted, executed the instrument.`,
      ``,
      `_________________________`,
      `Notary Public`,
    ];
    
    content.forEach((line) => {
      if (yPosition < 60) {
        // Add new page if needed
        const newPage = pdfDoc.addPage([612, 792]);
        yPosition = newPage.getSize().height - 60;
        page = newPage;
      }
      
      const fontSize = line.includes(':') && line.length < 30 ? 12 : 11;
      const textFont = line.includes(':') && line.length < 30 ? boldFont : font;
      
      page.drawText(line, {
        x: 60,
        y: yPosition,
        size: fontSize,
        font: textFont,
        color: rgb(0, 0, 0),
      });
      
      yPosition -= fontSize + 4;
    });
    
    return pdfDoc;
  } catch (error) {
    console.error('Error creating PoA template:', error);
    throw error;
  }
};

const addWatermark = async (pdfDoc) => {
  try {
    const pages = pdfDoc.getPages();
    const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    
    pages.forEach(page => {
      const { width, height } = page.getSize();
      
      // Add diagonal watermark
      page.drawText('PREVIEW - NOT FOR DOWNLOAD', {
        x: width / 2 - 150,
        y: height / 2,
        size: 24,
        font: font,
        color: rgb(0.8, 0.8, 0.8),
        rotate: degrees(45), // 45 degree rotation
      });
      
      // Add footer watermark
      page.drawText('PREVIEW ONLY - PAYMENT REQUIRED FOR FINAL VERSION', {
        x: 60,
        y: 30,
        size: 10,
        font: font,
        color: rgb(0.6, 0.6, 0.6),
      });
    });
  } catch (error) {
    console.error('Error adding watermark:', error);
    throw error;
  }
};

// Routes
app.post('/api/generate-preview', async (req, res) => {
  try {
    console.log('Received preview request:', req.body);
    const { documentType, formData, sessionId } = req.body;
    
    if (!documentType || !formData || !sessionId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    let pdfDoc;
    if (documentType === 'will') {
      pdfDoc = await createWillTemplate(formData);
    } else if (documentType === 'poa') {
      pdfDoc = await createPoATemplate(formData);
    } else {
      return res.status(400).json({ error: 'Invalid document type' });
    }
    
    // Add watermark for preview
    await addWatermark(pdfDoc);
    
    const pdfBytes = await pdfDoc.save();
    
    // Store the data for later use
    userSessions.set(sessionId, { documentType, formData, hasPaid: false });
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline; filename=preview.pdf');
    res.send(Buffer.from(pdfBytes));
  } catch (error) {
    console.error('Error generating preview:', error);
    res.status(500).json({ error: 'Failed to generate preview: ' + error.message });
  }
});

app.post('/api/simulate-payment', async (req, res) => {
  try {
    const { sessionId } = req.body;
    
    if (!userSessions.has(sessionId)) {
      return res.status(404).json({ error: 'Session not found' });
    }
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mark as paid
    const sessionData = userSessions.get(sessionId);
    sessionData.hasPaid = true;
    userSessions.set(sessionId, sessionData);
    
    res.json({ success: true, message: 'Payment processed successfully' });
  } catch (error) {
    console.error('Error processing payment:', error);
    res.status(500).json({ error: 'Payment processing failed' });
  }
});

app.post('/api/download-final', async (req, res) => {
  try {
    const { sessionId } = req.body;
    
    const sessionData = userSessions.get(sessionId);
    if (!sessionData) {
      return res.status(404).json({ error: 'Session not found' });
    }
    
    if (!sessionData.hasPaid) {
      return res.status(403).json({ error: 'Payment required' });
    }
    
    let pdfDoc;
    if (sessionData.documentType === 'will') {
      pdfDoc = await createWillTemplate(sessionData.formData);
    } else if (sessionData.documentType === 'poa') {
      pdfDoc = await createPoATemplate(sessionData.formData);
    }
    
    // No watermark for final version
    const pdfBytes = await pdfDoc.save();
    
    const filename = sessionData.documentType === 'will' ? 'will.pdf' : 'power_of_attorney.pdf';
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
    res.send(Buffer.from(pdfBytes));
  } catch (error) {
    console.error('Error generating final document:', error);
    res.status(500).json({ error: 'Failed to generate final document' });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Server error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});