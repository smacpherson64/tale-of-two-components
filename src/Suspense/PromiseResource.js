import * as React from "react";

export class PromiseResource {
  constructor(promise) {
    this.status = "pending";
    this.promise = promise.then(
      (value) => {
        this.status = "fulfilled";
        this.value = value;
        return value;
      },
      (error) => {
        this.status = "rejected";
        this.error = error;
        return error;
      }
    );
  }

  /**
   * Creates a fulfilled PromiseResource **synchronously** from a value.
   */
  static resolve(value) {
    const resource = new PromiseResource(Promise.resolve(value));
    resource.status = "fulfilled";
    resource.value = value;
    return resource;
  }

  /**
   * Creates a rejected PromiseResource **synchronously** from a value.
   */
  static reject(value) {
    const resource = new PromiseResource(Promise.reject(value));
    resource.status = "rejected";
    resource.error = value;
    return resource;
  }
}

/**
 * @param {[...resources: PromiseResource[]] | PromiseResource[] | PromiseResource} resource
 */
export const usePromiseResource = (...resources) => {
  // Handling a single resource passed
  if (resources.length === 1 && resources[0] instanceof PromiseResource) {
    const resource = resources[0];

    if (resource.status === "pending") {
      throw resource.promise;
    }

    if (resource.status === "rejected") {
      throw resource.error;
    }

    return resource.value;
  }

  // Handleing multiple resources passed via spread OR array
  const resourceList = Array.isArray(resources[0]) ? resources[0] : resources;

  const erroredResource = resourceList.find(
    (resource) => resource.status === "rejected"
  );

  if (erroredResource) {
    throw erroredResource.error;
  }

  const pendingResources = resourceList.filter(
    (resource) => resource.status === "pending"
  );

  if (pendingResources.length > 0) {
    throw Promise.all(pendingResources.map((resource) => resource.promise));
  }

  return resourceList.map((resource) => resource.value);
};

/**
 * CONCEPT DO NOT USE
 */
class ExampleResourceCache {
  #__resources = new Map();
  #subscriptions = [];

  set = ({ key, resource }) => {
    this.#__resources.set(key, resource);

    this.#subscriptions
      .filter(([keys]) => keys.includes(key))
      .forEach((fn) => fn(value));
  };

  cache = (key, fn) => {
    if (!this.#__resources.get(key)) {
      this.set({ key, resource: fn() });
    }

    return this.#__resources.get(key);
  };

  // This is a custom hook used to work with the cache
  /* eslint-disable react-hooks/rules-of-hooks */
  usePromiseResource = ({ key, cache }) => {
    const _this = this;
    const [resource, setResource] = React.useState(_this.cache(key, cache));

    React.useEffect(
      function () {
        const subscriber = [[key], setResource];

        _this.#subscriptions.push(subscriber);
        return () => _this.#subscriptions.filter((item) => item !== subscriber);
      },
      [_this.subscriptions, key]
    );

    return usePromiseResource(resource);
  };
}

export const ResourceCache = new ExampleResourceCache();
