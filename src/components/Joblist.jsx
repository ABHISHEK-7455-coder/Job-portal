import { useEffect, useState, useCallback, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useDataLoader } from '../hooks/useDataLoader';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';

import {
  setSelectedCategory,
  setSelectedCompany,
  setSearchQuery,
  setSelectedExperience,
  setSelectedLocation,
  setSelectedType,
  setSelectedSalary,
  setJobsPerPage,
  clearFilters,
  resetJobs
} from '../redux/store';
import './JobList.css';
import { saveJob } from '../redux/savedJobsSlice';
import { useLocation } from 'react-router-dom';

// Loading Spinner Component
const LoadingSpinner = ({ isLoadingMore = false }) => (
  <div className={loading-spinner ${isLoadingMore ? 'loading-more' : 'loading-initial'}}>
    <div className="spinner"></div>
    <span>{isLoadingMore ? 'Loading more jobs...' : 'Loading jobs...'}</span>
  </div>
);

// Job Stats Component
const JobStats = ({ pagination, infiniteScroll, onJobsPerPageChange }) => {
  const currentJobCount = pagination.endIndex || 0;
  const totalJobs = pagination.totalJobs || 0;
  
  return (
    <div className="job-stats">
      <div className="stats-info">
        Showing {currentJobCount} of {totalJobs} jobs
        {infiniteScroll.hasMore && (
          <span className="more-available"> • Scroll for more</span>
        )}
      </div>
      <div className="jobs-per-page-selector">
        <label>
          Jobs per load:
          <select
            value={pagination.jobsPerPage}
            onChange={onJobsPerPageChange}
            className="jobs-per-page-select"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={30}>30</option>
            <option value={50}>50</option>
          </select>
        </label>
      </div>
    </div>
  );
};

// Infinite Scroll Sentinel Component
const InfiniteScrollSentinel = ({ sentinelRef, hasMore, isLoading, loadingMore }) => {
  console.log('🎯 Sentinel render:', { hasMore, isLoading, loadingMore });
  
  if (!hasMore) {
    return (
      <div className="end-of-results">
        <div className="end-message">
          <i className="fa fa-check-circle"></i>
          <span>You've reached the end of all available jobs</span>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={sentinelRef} 
      className="infinite-scroll-sentinel"
      style={{
        minHeight: '100px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        margin: '20px 0',
        backgroundColor: 'rgba(150, 132, 192, 0.1)',
        borderRadius: '8px',
        border: '2px dashed #9684C0'
      }}
    >
      {(isLoading || loadingMore) ? (
        <LoadingSpinner isLoadingMore={loadingMore} />
      ) : (
        <div style={{ 
          padding: '20px', 
          textAlign: 'center', 
          color: '#666',
          fontSize: '14px' 
        }}>
          <i className="fa fa-arrow-down" style={{ marginRight: '8px' }}></i>
          Scroll to load more jobs
        </div>
      )}
    </div>
  );
};

const JobList = () => {
  const dispatch = useDispatch();
  const { 
    jobs, 
    categories, 
    companies, 
    loading, 
    loadingMore, 
    error, 
    filters, 
    pagination, 
    infiniteScroll 
  } = useSelector((state) => state.jobs);
  
  const { loadMoreJobs, loadAllData, loadInitialJobs } = useDataLoader();
  const [toast, setToast] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const isJobPage = location.pathname === '/jobs';
  const [locationSearchInput, setLocationSearchInput] = useState('');
  const [searchInput, setSearchInput] = useState('');

  // Track if component has been initialized
  const isInitializedRef = useRef(false);
  const hasLoadedInitialDataRef = useRef(false);

  // Enhanced infinite scroll hook with logging
  const loadMoreJobsCallback = useCallback(async () => {
    console.log('🔄 loadMoreJobsCallback triggered');
    console.log('Current state:', {
      hasMore: infiniteScroll.hasMore,
      isInitialLoad: infiniteScroll.isInitialLoad,
      lastLoadedPage: infiniteScroll.lastLoadedPage,
      totalJobs: jobs.length
    });
    
    if (infiniteScroll.hasMore && !infiniteScroll.isInitialLoad) {
      await loadMoreJobs();
    } else {
      console.log('⏭ Skipping loadMore - conditions not met');
    }
  }, [loadMoreJobs, infiniteScroll.hasMore, infiniteScroll.isInitialLoad]);

  // Use infinite scroll hook
  const { sentinelRef } = useInfiniteScroll(
    loadMoreJobsCallback,
    infiniteScroll.hasMore,
    loading || loadingMore
  );

  // Debounce search input
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (searchInput !== filters.searchQuery) {
        dispatch(setSearchQuery(searchInput));
      }
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [searchInput, filters.searchQuery, dispatch]);

  const showToast = useCallback((message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  }, []);

  // Update local state when Redux filters change
  useEffect(() => {
    if (filters.selectedLocation?.length > 0) {
      setLocationSearchInput(filters.selectedLocation[0]);
    } else {
      setLocationSearchInput('');
    }
    setSearchInput(filters.searchQuery || '');
  }, [filters.selectedLocation, filters.searchQuery]);

  // Sidebar management effects (unchanged)
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isSidebarOpen && !event.target.closest('.filters-sidebar') && !event.target.closest('.filter-toggle')) {
        setIsSidebarOpen(false);
      }
    };

    if (isSidebarOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isSidebarOpen]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768 && isSidebarOpen) {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isSidebarOpen]);

  // FIXED: Initial data loading - only runs once on mount
  useEffect(() => {
    if (!hasLoadedInitialDataRef.current) {
      console.log("🚀 JobList: Initial mount - calling loadAllData");
      hasLoadedInitialDataRef.current = true;
      loadAllData();
    }
  }, []); // Empty dependency array - runs only once

  // FIXED: Re-loading jobs when filters change - only after initial load
  useEffect(() => {
    // Skip if we haven't loaded initial data yet
    if (!hasLoadedInitialDataRef.current || !isInitializedRef.current) {
      isInitializedRef.current = true;
      return;
    }

    console.log("🔄 JobList: Filters changed, triggering loadInitialJobs");
    loadInitialJobs();

  }, [
    filters.selectedCategory,
    filters.selectedCompany,
    filters.searchQuery,
    filters.selectedExperience,
    filters.selectedLocation,
    filters.selectedType,
    filters.selectedSalary,
    pagination.jobsPerPage,
    loadInitialJobs
  ]);

  // Handle jobs per page change
  const handleJobsPerPageChange = useCallback((e) => {
    const newJobsPerPage = parseInt(e.target.value);
    if (newJobsPerPage !== pagination.jobsPerPage) {
      console.log('📊 Jobs per page changed:', newJobsPerPage);
      dispatch(setJobsPerPage(newJobsPerPage));
    }
  }, [dispatch, pagination.jobsPerPage]);

  // Memoized salary formatter
  const formatSalary = useCallback((salary) => {
    if (!salary?.min && !salary?.max) return 'Salary not specified';
    
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: salary.currency || 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });

    if (salary.min && salary.max) {
      return ${formatter.format(salary.min)} - ${formatter.format(salary.max)};
    } else if (salary.min) {
      return From ${formatter.format(salary.min)};
    } else if (salary.max) {
      return Up to ${formatter.format(salary.max)};
    }
    return 'Salary not specified';
  }, []);

  const handleClearFilters = useCallback(() => {
    dispatch(clearFilters());
    setLocationSearchInput('');
    setSearchInput('');
  }, [dispatch]);

  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen(prev => !prev);
  }, []);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Loading state for initial load
  if (loading && jobs.length === 0 && !hasLoadedInitialDataRef.current) {
    return <div className="loading-container"><LoadingSpinner /></div>;
  }

  // Error state for initial load
  if (error && jobs.length === 0 && !loading && !loadingMore) {
    return (
      <div className="error-container">
        <div className="error-message">
          <i className="fa fa-exclamation-triangle"></i>
          <h3>Oops! Something went wrong</h3>
          <p>{error}</p>
          <button onClick={() => loadInitialJobs()} className="retry-btn">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Static filter options
  const experienceOptions = ['Fresher', 'Mid-level', 'Senior', '1 yr', '2 yrs', '3 yrs', '4 yrs', '5 yrs'];
  const locationOptions = ['Remote', 'Seattle, WA', 'Cupertino, CA', 'New Delhi, India', 'Boston, MA', 'San Francisco, CA'];
  const typeOptions = ['Full-time', 'Part-time', 'Contract'];
  const salaryRangeOptions = ['0-50000', '50001-100000', '100001-150000', '150001-200000', '200001-300000'];

  console.log('🎨 JobList render:', {
    jobsCount: jobs.length,
    hasMore: infiniteScroll.hasMore,
    isLoading: loading,
    loadingMore: loadingMore,
    lastLoadedPage: infiniteScroll.lastLoadedPage
  });

  return (
    <div className="job-list-container">
      {/* Back to top button */}
      <button 
        className="back-to-top-btn"
        onClick={scrollToTop}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          zIndex: 1000,
          display: jobs.length > 10 ? 'block' : 'none'
        }}
      >
        <i className="fa fa-arrow-up"></i>
      </button>

      {/* Mobile filter toggle button */}
      <button className="filter-toggle" onClick={toggleSidebar}>
        <i className="fa fa-filter"></i> Filters
      </button>

      {/* Sidebar overlay for mobile */}
      <div className={sidebar-overlay ${isSidebarOpen ? 'show' : ''}} onClick={() => setIsSidebarOpen(false)}></div>

      <div className="job-list-layout">
        <div className={filters-sidebar ${isSidebarOpen ? 'open' : ''}}>
          <div className="filters-section">
            {/* Filter groups - same as before */}
            <div className="filter-group">
              <h4>Category</h4>
              {categories.map((category) => (
                <label key={category.id} className="filter-checkbox">
                  <input
                    type="checkbox"
                    checked={filters.selectedCategory?.includes(category.id)}
                    onChange={() => {
                      const current = filters.selectedCategory || [];
                      const updated = current.includes(category.id)
                        ? current.filter((id) => id !== category.id)
                        : [...current, category.id];
                      dispatch(setSelectedCategory(updated));
                    }}
                  />
                  {category.name}
                </label>
              ))}
            </div>

            <div className="filter-group">
              <h4>Company</h4>
              {companies.map((company) => (
                <label key={company.id} className="filter-checkbox">
                  <input
                    type="checkbox"
                    checked={filters.selectedCompany?.includes(company.id)}
                    onChange={() => {
                      const current = filters.selectedCompany || [];
                      const updated = current.includes(company.id)
                        ? current.filter((id) => id !== company.id)
                        : [...current, company.id];
                      dispatch(setSelectedCompany(updated));
                    }}
                  />
                  {company.name}
                </label>
              ))}
            </div>

            {/* Other filter groups - experience, location, type, salary */}
            <div className="filter-group">
              <h4>Experience</h4>
              {experienceOptions.map((level) => (
                <label key={level} className="filter-checkbox">
                  <input
                    type="checkbox"
                    checked={filters.selectedExperience?.includes(level)}
                    onChange={() => {
                      const current = filters.selectedExperience || [];
                      const updated = current.includes(level)
                        ? current.filter((e) => e !== level)
                        : [...current, level];
                      dispatch(setSelectedExperience(updated));
                    }}
                  />
                  {level}
                </label>
              ))}
            </div>

            <div className="filter-group">
              <h4>Location</h4>
              {locationOptions.map((location) => (
                <label key={location} className="filter-checkbox">
                  <input
                    type="checkbox"
                    checked={filters.selectedLocation?.includes(location)}
                    onChange={() => {
                      const current = filters.selectedLocation || [];
                      const updated = current.includes(location)
                        ? current.filter((l) => l !== location)
                        : [...current, location];
                      dispatch(setSelectedLocation(updated));
                    }}
                  />
                  {location}
                </label>
              ))}
            </div>

            <div className="filter-group">
              <h4>Type</h4>
              {typeOptions.map((type) => (
                <label key={type} className="filter-checkbox">
                  <input
                    type="checkbox"
                    checked={filters.selectedType?.includes(type)}
                    onChange={() => {
                      const current = filters.selectedType || [];
                      const updated = current.includes(type)
                        ? current.filter((t) => t !== type)
                        : [...current, type];
                      dispatch(setSelectedType(updated));
                    }}
                  />
                  {type}
                </label>
              ))}
            </div>

            <div className="filter-group">
              <h4>Salary Range</h4>
              {salaryRangeOptions.map((range) => (
                <label key={range} className="filter-checkbox">
                  <input
                    type="checkbox"
                    checked={filters.selectedSalary?.includes(range)}
                    onChange={() => {
                      const current = filters.selectedSalary || [];
                      const updated = current.includes(range)
                        ? current.filter((r) => r !== range)
                        : [...current, range];
                      dispatch(setSelectedSalary(updated));
                    }}
                  />
                  {range}
                </label>
              ))}
            </div>

            <button onClick={handleClearFilters} className="clear-filters-btn">
              Clear Filters
            </button>
          </div>
        </div>

        <div className="jobs-content">
          {/* Search Bar */}
          {isJobPage && (
            <div className="search-bar sticky-search-bar">
              <div className="search-field">
                <span className="icon"><i className="fa fa-search"></i></span>
                <input
                  type="text"
                  placeholder="Enter skills / designations / companies"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      dispatch(setSearchQuery(searchInput));
                    }
                  }}
                />
              </div>
              <div className="divider" />
              <select
                className="experience-dropdown"
                value=""
                onChange={(e) => {
                  const selectedExp = e.target.value;
                  if (selectedExp) {
                    const current = filters.selectedExperience || [];
                    const updated = current.includes(selectedExp)
                      ? current.filter((exp) => exp !== selectedExp)
                      : [...current, selectedExp];
                    dispatch(setSelectedExperience(updated));
                  }
                }}
              >
                <option value="">Select experience</option>
                {experienceOptions.map((exp) => (
                  <option key={exp} value={exp}>{exp}</option>
                ))}
              </select>
              <div className="divider" />
              <input
                type="text"
                className="location-input"
                placeholder="Enter location"
                value={locationSearchInput}
                onChange={(e) => {
                  const locationValue = e.target.value;
                  setLocationSearchInput(locationValue);
                  
                  if (locationValue.trim()) {
                    dispatch(setSelectedLocation([locationValue.trim()]));
                  } else {
                    dispatch(setSelectedLocation([]));
                  }
                }}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    const locationValue = e.target.value.trim();
                    if (locationValue) {
                      dispatch(setSelectedLocation([locationValue]));
                    }
                  }
                }}
              />
              <button className="search-btn" onClick={() => {
                dispatch(setSearchQuery(searchInput.trim()));
              }}>
                Search
              </button>
            </div>
          )}

          {/* Job Stats */}
          <JobStats 
            pagination={pagination}
            infiniteScroll={infiniteScroll}
            onJobsPerPageChange={handleJobsPerPageChange}
          />

          {/* Jobs Grid */}
          <div className="jobs-grid">
            {jobs.length === 0 && !loading ? (
              <div className="no-jobs">
                <div className="no-jobs-message">
                  <i className="fa fa-search"></i>
                  <h3>No jobs found</h3>
                  <p>Try adjusting your search criteria or filters</p>
                  <button onClick={handleClearFilters} className="clear-filters-btn">
                    Clear All Filters
                  </button>
                </div>
              </div>
            ) : (
              <>
                {jobs.map((job, index) => (
                  <div key={job-${job.id}-${index}} className="job-card">
                    <div className="job-header">
                      <h2 className="job-title">{job.title || 'No Title'}</h2>
                      <div className="job-meta">
                        <span className="company-name">{job.companies?.name || job.company?.name || 'Company not specified'}</span>
                        <span className="job-location">{job.location || 'Location not specified'}</span>
                      </div>
                    </div>

                    <div className="job-details">
                      <div className="job-category">
                        <span className="category-badge">{job.categories?.name || job.category?.name || 'Category not specified'}</span>
                      </div>

                      <div className="job-info">
                        <p><strong>Experience:</strong> {job.experience || 'Not specified'}</p>
                        <p><strong>Type:</strong> {job.type || 'Not specified'}</p>
                        <p><strong>Salary:</strong> {formatSalary(job.salary)}</p>
                      </div>

                      <div className="job-description">
                        <p>{job.description || 'No description available'}</p>
                      </div>

                      {job.requirements?.length > 0 && (
                        <div className="job-requirements">
                          <h4>Requirements:</h4>
                          <ul>
                            {job.requirements.map((req, reqIndex) => (
                              <li key={reqIndex}>{req}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <div className="job-footer">
                        <span className="posted-date">
                          Posted: {job.postedDate || job.created_at ? new Date(job.postedDate || job.created_at).toLocaleDateString() : 'Date not available'}
                        </span>
                        <div className="job-actions">
                          {job.applyUrl || job.apply_url || job.applicationUrl || job.application_url || job.url || job.link ? (
                            <a href={job.applyUrl || job.apply_url || job.applicationUrl || job.application_url || job.url || job.link} target="_blank" rel="noopener noreferrer">
                              <button className="apply-btn">Apply Now</button>
                            </a>
                          ) : (
                            <button 
                              className="apply-btn disabled"
                              onClick={() => showToast("Application link not available for this job")}
                              title="Application link not available"
                            >
                              Apply
                            </button>
                          )}
                          <button
                            onClick={() => {
                              dispatch(saveJob(job));
                              showToast("Job saved successfully!");
                              if (window.innerWidth <= 768) {
                                setIsSidebarOpen(false);
                              }
                            }}
                            className="save-btn"
                          >
                            Save Job
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {/* FIXED: Infinite Scroll Sentinel - Always render when there are jobs */}
                {jobs.length > 0 && (
                  <InfiniteScrollSentinel
                    sentinelRef={sentinelRef}
                    hasMore={infiniteScroll.hasMore}
                    isLoading={loading}
                    loadingMore={loadingMore}
                  />
                )}
              </>
            )}
          </div>

          {/* Error Message for load more failures */}
          {error && jobs.length > 0 && (
            <div className="load-more-error">
              <p>Failed to load more jobs: {error}</p>
              <button onClick={loadMoreJobs} className="retry-btn">
                Try Again
              </button>
            </div>
          )}
        </div>
      </div>
      
      {toast && <div className="toast-popup">{toast}</div>}
    </div>
  );
};

export default JobList;