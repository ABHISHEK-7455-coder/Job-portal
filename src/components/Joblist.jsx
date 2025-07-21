import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  setJobs,
  setCategories,
  setCompanies,
  setLoading,
  setError,
  setSelectedCategory,
  setSelectedCompany,
  setSearchQuery,
  setSelectedExperience,
  setSelectedLocation,
  setSelectedType,
  setSelectedSalary,
  clearFilters,
} from '../redux/jobSlice';
import { saveJob } from '../redux/savedJobsSlice';
import './Joblist.css';

const JobList = () => {
  const dispatch = useDispatch();
  const { jobs, categories, companies, loading, error, filters } = useSelector((state) => state.jobs);

  useEffect(() => {
    fetchInitialData();
  }, [dispatch]);

  const fetchInitialData = async () => {
    dispatch(setLoading(true));
    try {
      const [jobsRes, categoriesRes, companiesRes] = await Promise.all([
        fetch('/api/jobs'),
        fetch('/api/categories'),
        fetch('/api/companies'),
      ]);

      const jobsData = await jobsRes.json();
      const categoriesData = await categoriesRes.json();
      const companiesData = await companiesRes.json();

      dispatch(setJobs(jobsData.jobs));
      dispatch(setCategories(categoriesData.categories));
      dispatch(setCompanies(companiesData.companies));
    } catch (err) {
      dispatch(setError('Failed to fetch data'));
    }
  };

  const filteredJobs = jobs.filter((job) => {
    const category = categories.find((cat) => cat.id === job.categoryId);
    const company = companies.find((comp) => comp.id === job.company.id);
    if (!category || !company) return false;

    if (filters.selectedCategory?.length > 0 && !filters.selectedCategory.includes(job.categoryId)) return false;
    if (filters.selectedCompany?.length > 0 && !filters.selectedCompany.includes(job.company.id)) return false;
    if (filters.selectedExperience?.length > 0 && !filters.selectedExperience.includes(job.experience)) return false;
    if (filters.selectedLocation?.length > 0 && !filters.selectedLocation.includes(job.location)) return false;
    if (filters.selectedType?.length > 0 && !filters.selectedType.includes(job.type)) return false;
    if (filters.selectedSalary?.length > 0) {
      const [minSalary, maxSalary] = job.salary ? [job.salary.min, job.salary.max] : [0, 0];
      const match = filters.selectedSalary.some(range => {
        const [min, max] = range.split('-').map(Number);
        return minSalary >= min && maxSalary <= max;
      });
      if (!match) return false;
    }
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      return (
        job.title.toLowerCase().includes(query) ||
        company.name.toLowerCase().includes(query) ||
        job.location.toLowerCase().includes(query) ||
        job.description.toLowerCase().includes(query)
      );
    }

    return true;
  });

  const formatSalary = (salary) => {
    if (!salary || salary.min === null || salary.max === null) return 'Salary not specified';
    return `${salary.currency} ${salary.min.toLocaleString()} - ${salary.max.toLocaleString()}`;
  };

  if (loading) return <div className="loading">Loading jobs...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="job-list-container">
      <div className="search-box">
        <input
          type="text"
          placeholder="Search jobs..."
          value={filters.searchQuery}
          onChange={(e) => dispatch(setSearchQuery(e.target.value))}
          className="search-input"
        />
      </div>

      <div className="results-count">Showing {filteredJobs.length} jobs</div>

      <div className="jobs-grid">
        {filteredJobs.length === 0 ? (
          <div className="no-jobs">No jobs found matching your criteria</div>
        ) : (
          filteredJobs.map((job) => (
            <div key={job.id} className="job-card">
              <div className="job-header">
                <h2 className="job-title">{job.title}</h2>
                <div className="job-meta">
                  <span className="company-name">{job.company.name}</span>
                  <span className="job-location">{job.location}</span>
                </div>
              </div>

              <div className="job-details">
                <div className="job-category">
                  <span className="category-badge">{job.category.name}</span>
                </div>

                <div className="job-info">
                  <p><strong>Experience:</strong> {job.experience}</p>
                  <p><strong>Type:</strong> {job.type}</p>
                  <p><strong>Salary:</strong> {formatSalary(job.salary)}</p>
                </div>

                <div className="job-description">
                  <p>{job.description}</p>
                </div>

                {job.requirements && job.requirements.length > 0 && (
                  <div className="job-requirements">
                    <h4>Requirements:</h4>
                    <ul>
                      {job.requirements.map((req, index) => (
                        <li key={index}>{req}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="job-footer">
                  <span className="posted-date">
                    Posted: {new Date(job.postedDate).toLocaleDateString()}
                  </span>
                  <div className="job-actions">
                    <a href={job.applyUrl} target="_blank" rel="noopener noreferrer">
                      <button className="apply-btn">Apply Now</button>
                    </a>
                    <button onClick={() => dispatch(saveJob(job))} className="save-btn">
                      Save Job
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default JobList;
