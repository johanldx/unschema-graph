const URI_SCHEME = /^[a-zA-Z][a-zA-Z0-9+.-]*:/;

function withHttpScheme(url: string): string {
  return /^https?:\/\//i.test(url) ? url : `https://${url}`;
}

export function resolveReferenceId(id: string, baseUrl?: string): string {
  if (!baseUrl || !id || typeof id !== 'string') {
    return id;
  }

  const trimmed = id.trim();
  if (URI_SCHEME.test(trimmed)) {
    return trimmed;
  }

  try {
    const base = baseUrl.trim();
    const baseWithScheme = withHttpScheme(base);
    const resolvedUrl = trimmed.startsWith('#')
      ? new URL(trimmed, baseWithScheme.endsWith('/') ? baseWithScheme : `${baseWithScheme}/`)
      : new URL(trimmed, baseWithScheme);

    return resolvedUrl.href;
  } catch {
    const cleanBase = baseUrl.trim().replace(/\/+$/, '');
    if (trimmed.startsWith('#')) {
      return `${cleanBase}/${trimmed}`;
    }
    if (trimmed.startsWith('/')) {
      return `${cleanBase}${trimmed}`;
    }
    return `${cleanBase}/${trimmed}`;
  }
}

export function canonicalDocumentUrl(url: string): string | undefined {
  try {
    const resolved = resolveReferenceId('#', url);
    const canonical = new URL(withHttpScheme(resolved));
    canonical.hash = '';
    return canonical.href;
  } catch {
    return undefined;
  }
}

export function isSameDocumentReference(referenceId: string, documentUrl?: string): boolean {
  const reference = referenceId.trim();
  if (!reference) {
    return false;
  }

  if (reference.startsWith('#')) {
    return true;
  }

  if (!documentUrl) {
    return !URI_SCHEME.test(reference);
  }

  const canonicalDocument = canonicalDocumentUrl(documentUrl);
  const canonicalReference = canonicalDocumentUrl(resolveReferenceId(reference, documentUrl));
  return canonicalDocument !== undefined && canonicalReference === canonicalDocument;
}
