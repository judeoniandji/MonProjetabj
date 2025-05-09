"""
Routes API pour les données sénégalaises (universités, entreprises, offres d'emploi)
"""

from flask import jsonify, request
from app.senegal import bp

# Import des données sénégalaises
from app.senegal.data import SENEGAL_UNIVERSITIES, SENEGAL_COMPANIES, SENEGAL_JOBS

# Route pour obtenir toutes les universités sénégalaises
@bp.route('/universities', methods=['GET'])
def get_universities():
    """Récupère la liste des universités sénégalaises"""
    return jsonify({
        'status': 'success',
        'count': len(SENEGAL_UNIVERSITIES),
        'data': SENEGAL_UNIVERSITIES
    })

# Route pour obtenir une université spécifique
@bp.route('/universities/<string:university_id>', methods=['GET'])
def get_university(university_id):
    """Récupère les détails d'une université sénégalaise spécifique"""
    university = next((u for u in SENEGAL_UNIVERSITIES if u['id'] == university_id), None)
    
    if not university:
        return jsonify({
            'status': 'error',
            'message': f"Université avec l'ID {university_id} non trouvée"
        }), 404
    
    return jsonify({
        'status': 'success',
        'data': university
    })

# Route pour obtenir toutes les entreprises sénégalaises
@bp.route('/companies', methods=['GET'])
def get_companies():
    """Récupère la liste des entreprises sénégalaises"""
    # Filtrer par industrie si spécifié
    industry = request.args.get('industry')
    
    if industry:
        filtered_companies = [c for c in SENEGAL_COMPANIES if c['industry'].lower() == industry.lower()]
        return jsonify({
            'status': 'success',
            'count': len(filtered_companies),
            'data': filtered_companies
        })
    
    return jsonify({
        'status': 'success',
        'count': len(SENEGAL_COMPANIES),
        'data': SENEGAL_COMPANIES
    })

# Route pour obtenir une entreprise spécifique
@bp.route('/companies/<string:company_id>', methods=['GET'])
def get_company(company_id):
    """Récupère les détails d'une entreprise sénégalaise spécifique"""
    company = next((c for c in SENEGAL_COMPANIES if c['id'] == company_id), None)
    
    if not company:
        return jsonify({
            'status': 'error',
            'message': f"Entreprise avec l'ID {company_id} non trouvée"
        }), 404
    
    return jsonify({
        'status': 'success',
        'data': company
    })

# Route pour obtenir toutes les offres d'emploi au Sénégal
@bp.route('/jobs', methods=['GET'])
def get_jobs():
    """Récupère la liste des offres d'emploi au Sénégal avec filtres optionnels"""
    # Paramètres de filtrage
    company_id = request.args.get('company_id')
    job_type = request.args.get('job_type')
    location = request.args.get('location')
    field_of_study = request.args.get('field_of_study')
    
    filtered_jobs = SENEGAL_JOBS
    
    # Appliquer les filtres si spécifiés
    if company_id:
        filtered_jobs = [j for j in filtered_jobs if j['company_id'] == company_id]
    
    if job_type:
        filtered_jobs = [j for j in filtered_jobs if j['job_type'] == job_type]
    
    if location:
        filtered_jobs = [j for j in filtered_jobs if location.lower() in j['location'].lower()]
    
    if field_of_study:
        filtered_jobs = [j for j in filtered_jobs if j['field_of_study'] == field_of_study]
    
    # Enrichir les données des offres avec les informations de l'entreprise
    enriched_jobs = []
    for job in filtered_jobs:
        company = next((c for c in SENEGAL_COMPANIES if c['id'] == job['company_id']), None)
        enriched_job = job.copy()
        if company:
            enriched_job['company_name'] = company['name']
            enriched_job['company_logo'] = company['logo']
            enriched_job['company_industry'] = company['industry']
        
        enriched_jobs.append(enriched_job)
    
    return jsonify({
        'status': 'success',
        'count': len(enriched_jobs),
        'data': enriched_jobs
    })

# Route pour obtenir une offre d'emploi spécifique
@bp.route('/jobs/<string:job_id>', methods=['GET'])
def get_job(job_id):
    """Récupère les détails d'une offre d'emploi spécifique"""
    job = next((j for j in SENEGAL_JOBS if j['id'] == job_id), None)
    
    if not job:
        return jsonify({
            'status': 'error',
            'message': f"Offre d'emploi avec l'ID {job_id} non trouvée"
        }), 404
    
    # Enrichir avec les données de l'entreprise
    company = next((c for c in SENEGAL_COMPANIES if c['id'] == job['company_id']), None)
    enriched_job = job.copy()
    
    if company:
        enriched_job['company_name'] = company['name']
        enriched_job['company_logo'] = company['logo']
        enriched_job['company_description'] = company['description']
        enriched_job['company_industry'] = company['industry']
        enriched_job['company_website'] = company['website']
    
    return jsonify({
        'status': 'success',
        'data': enriched_job
    })

# Route pour obtenir les statistiques du marché de l'emploi au Sénégal
@bp.route('/job-stats', methods=['GET'])
def get_job_stats():
    """Récupère des statistiques sur le marché de l'emploi au Sénégal"""
    # Statistiques par type d'emploi
    job_types = {}
    for job in SENEGAL_JOBS:
        job_type = job['job_type']
        job_types[job_type] = job_types.get(job_type, 0) + 1
    
    # Statistiques par localisation
    locations = {}
    for job in SENEGAL_JOBS:
        location = job['location']
        locations[location] = locations.get(location, 0) + 1
    
    # Statistiques par domaine d'études
    fields = {}
    for job in SENEGAL_JOBS:
        field = job['field_of_study']
        fields[field] = fields.get(field, 0) + 1
    
    # Statistiques par entreprise
    companies = {}
    for job in SENEGAL_JOBS:
        company_id = job['company_id']
        company_name = next((c['name'] for c in SENEGAL_COMPANIES if c['id'] == company_id), 'Inconnu')
        companies[company_name] = companies.get(company_name, 0) + 1
    
    return jsonify({
        'status': 'success',
        'data': {
            'total_jobs': len(SENEGAL_JOBS),
            'by_job_type': job_types,
            'by_location': locations,
            'by_field': fields,
            'by_company': companies
        }
    })

# Route pour rechercher des offres d'emploi par mot-clé
@bp.route('/jobs/search', methods=['GET'])
def search_jobs():
    """Recherche des offres d'emploi par mot-clé"""
    query = request.args.get('q', '').lower()
    
    if not query:
        return jsonify({
            'status': 'error',
            'message': 'Paramètre de recherche (q) requis'
        }), 400
    
    # Rechercher dans le titre, la description et les compétences requises
    results = []
    for job in SENEGAL_JOBS:
        if (query in job['title'].lower() or 
            query in job['description'].lower() or 
            any(query in skill.lower() for skill in job['required_skills'])):
            
            # Enrichir avec les données de l'entreprise
            company = next((c for c in SENEGAL_COMPANIES if c['id'] == job['company_id']), None)
            enriched_job = job.copy()
            
            if company:
                enriched_job['company_name'] = company['name']
                enriched_job['company_logo'] = company['logo']
                enriched_job['company_industry'] = company['industry']
            
            results.append(enriched_job)
    
    return jsonify({
        'status': 'success',
        'count': len(results),
        'data': results
    })

# Route pour obtenir les industries présentes au Sénégal
@bp.route('/industries', methods=['GET'])
def get_industries():
    """Récupère la liste des industries présentes au Sénégal"""
    industries = sorted(list(set(company['industry'] for company in SENEGAL_COMPANIES)))
    
    return jsonify({
        'status': 'success',
        'count': len(industries),
        'data': industries
    })

# Route pour obtenir les programmes d'études disponibles au Sénégal
@bp.route('/study-programs', methods=['GET'])
def get_study_programs():
    """Récupère la liste des programmes d'études disponibles dans les universités sénégalaises"""
    all_programs = []
    for university in SENEGAL_UNIVERSITIES:
        all_programs.extend(university.get('programs', []))
    
    unique_programs = sorted(list(set(all_programs)))
    
    return jsonify({
        'status': 'success',
        'count': len(unique_programs),
        'data': unique_programs
    })
