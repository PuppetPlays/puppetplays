// Version simplifiée pour test
export default async function handler(req, res) {
  try {
    console.log('Test proxy called with:', req.url);
    console.log('Query params:', req.query);
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json');
    
    return res.status(200).json({
      success: true,
      method: req.method,
      url: req.url,
      query: req.query,
      message: 'Test proxy works!'
    });
  } catch (error) {
    console.error('Test proxy error:', error);
    return res.status(500).json({
      error: error.message
    });
  }
} 