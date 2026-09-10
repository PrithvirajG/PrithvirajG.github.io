---
title: Turning YouTube market videos into sentiment data
employer: algobulls-yun
status: production
disciplines: [data, nlp]
stack: [Python, Selenium, NLP, Web Scraping, NLTK, pandas]
summary: An automated pipeline that scrapes YouTube at scheduled intervals for stock market-related video content, extracts transcripts, and feeds the text into a language model for market sentiment analysis.
highlights:
  - Built with Selenium WebDriver for scheduled web scraping and data extraction from YouTube.
  - Automated transcript extraction from video content for downstream NLP processing.
  - Pipeline feeds into a language model for stock market situation analysis and user-queryable news summaries.
order: 2
---

An automated pipeline that queries and scrapes YouTube at scheduled intervals
to extract the latest stock market-related video content. It consolidates
videos in a database, extracts transcripts, and feeds the text into a
downstream language model for market sentiment analysis.
